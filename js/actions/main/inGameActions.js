import { SdkClient } from "../../sdkClient";
import { GameCore } from "shapez/game/core";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { T } from "shapez/translations";
import { BaseActions } from "../baseActions";
import { PlacementActions } from "../inGame/placementActions";
import { DeletionActions } from "../inGame/deletionActions";
import { ScannerActions } from "../inGame/scannerActions";
import { CameraActions } from "../inGame/cameraActions";
import { PinnedActions } from "../inGame/pinnedActions";
import { ToolbeltActions } from "../inGame/toolbeltActions";

export class InGameActions {
	/** @type {boolean} */ static scanned = false;
	/** @type {boolean} */ static deepScanned = false;
	/** @type {boolean} */ static buildingScanned = false;
	/** @type {boolean} */ static #initialized = false;

	/** @type {import("../../main").NeuroIntegration} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {Array<BaseActions>} */ #actioners;
	/** @type {boolean} */ #moving;

	/**
	 * @param {import("../../main").NeuroIntegration} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;

		this.#actioners = [
			new PlacementActions(root),
			new DeletionActions(root),
			new ScannerActions(root),
			new CameraActions(root),
			new PinnedActions(root),
			new ToolbeltActions(root),
		]

		if (!InGameActions.#initialized) {
			this.#initialize();
		}

		//this.#notificationActions.addAction(NotificationsActionList.CLOSE_NOTIFICATION);
	}

	gameOpenned() {
		if (SdkClient.isConnected()) {
			this.#connectEvents();
			this.#announceOpening();
			this.#activateActions();
		}
	}

	gameClosed() {
		InGameActions.scanned = false;
		InGameActions.deepScanned = false;
		InGameActions.buildingScanned = false;
		this.#deactivateActions();
	}

	playerSentAction(action) {
		let result = null;
		for (let i = 0; i < this.#actioners.length && result == null; i++) {
			result = this.#actioners[i].tryAction(action);
		}

		if (result == null) {
			result = {valid:false, msg:"Unknown action."};
		}

		SdkClient.tellActionResult(action.id, result.valid, result.msg);
	}

	#initialize() {
		const ourClass = this;

		this.#mod.modInterface.runAfterMethod(
			GameCore,
			"tick",
			function(deltaMs) {
				ourClass.#checkCameraMovement();
				return true;
			}
		);
	}

	#announceOpening() {
		const welcomeMessage = "A map has loaded. Now you can play the game!";
		if (!this.#mod.trySendTutorialMessage(welcomeMessage)) {
			SdkClient.sendMessage(welcomeMessage);
		}
	}

	#activateActions() {
		for (let i = 0; i < this.#actioners.length; i++) {
			this.#actioners[i].activate();
		}
	}

	#deactivateActions() {
		for (let i = 0; i < this.#actioners.length; i++) {
			this.#actioners[i].deactivate();
		}
	}

	//TODO This doesn't work when the player moves the camera slightly with mouse movement or keyboard
	#checkCameraMovement() {
		if (!this.#root.camera) {
			return;
		}

		if (this.#moving) {
			if (!this.#root.camera.viewportWillChange()) {
				this.#moving = false;
				this.#activateActions();
			}
		}
		else {
			if (this.#root.camera.viewportWillChange()) {
				this.#moving = true;
				this.#deactivateActions();
			}
		}
	}

	#connectEvents() {
		this.#root.hud.signals.unlockNotificationFinished.add(() => {this.#testCrazy()});
		this.#root.signals.storyGoalCompleted.add(this.#onStoryGoalCompleted, this);
	}

	#testCrazy() {
		//this.#notificationActions.removeAllActions();
		//this.#activateActions();
	}

	/**
	 * @param {number} level
	 * @param {enumHubGoalRewards} reward
	 */
	#onStoryGoalCompleted(level, reward) {
		const levels = this.#root.gameMode.getLevelDefinitions();

		if (level <= levels.length) {
			//this.#actions.removeAllActions();
			const desc = T.storyRewards[reward].desc;
			const descText = desc.replace(/<\s*br[^>]?>/,'\n').replace(/<[^>]*>/g,"");

			SdkClient.sendMessage(
				`Level ${level} completed! \r\n` +
				`${descText}`
			)
			//this.#notificationActions.activateActions();
		}
		else {
			SdkClient.sendMessage(
				`Level ${level} completed! Good luck on your next piece.`
			)
		}
	}
}