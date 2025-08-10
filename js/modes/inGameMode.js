import { SdkClient } from "../sdkClient";
import { PlacementActions } from "../actions/inGame/placementActions";
import { DeletionActions } from "../actions/inGame/deletionActions";
import { ScannerActions } from "../actions/inGame/scannerActions";
import { CameraActions } from "../actions/inGame/cameraActions";
import { PinnedActions } from "../actions/inGame/pinnedActions";
import { ToolbeltActions } from "../actions/inGame/toolbeltActions";
import { TutorialChecks } from "../helpers/tutorialChecks";
import { OverlaysActions } from "../actions/inGame/overlaysActions";
import { InGameState } from "shapez/states/ingame";
import { UpgradesActions } from "../actions/overlay/upgradesActions";
import { ActionsCollection } from "../actions/base/actionsCollection";
import { ShapeInfoActions } from "../actions/overlay/shapeInfoActions";
import { StatisticsActions } from "../actions/overlay/statisticsActions";
import { LevelRewardActions } from "../actions/overlay/levelRewardActions";

export class InGameMode {
	/** @type {import("../main").NeuroIntegration} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/**
	 * @param {import("../main").NeuroIntegration} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;
	}

	/** @param {InGameState} state */
	gameOpenned(state) {
		if (SdkClient.isConnected()) {
			this.#declareActions(state);
			this.#announceOpening();
			ActionsCollection.activateActions([
				"build", "delete", "scan", "camera", "pin", "tools", "overlay"
			])
		}
	}

	gameClosed() {
		TutorialChecks.scanned = false;
		TutorialChecks.deepScanned = false;
		TutorialChecks.buildingScanned = false;
		ActionsCollection.deactivateActions([
			"build", "delete", "scan", "camera", "pin", "tools", "overlay",
			"shop", "shape", "stats", "reward"
		], true)
	}

	/** @param {InGameState} state */
	#declareActions(state) {
		const actions = new Map();
		actions.set("build", new PlacementActions(this.#root));
		actions.set("delete", new DeletionActions(this.#root));
		actions.set("scan", new ScannerActions(this.#root));
		actions.set("camera", new CameraActions(this.#root));
		actions.set("pin", new PinnedActions(this.#root));
		actions.set("tools", new ToolbeltActions(this.#root));
		actions.set("overlay", new OverlaysActions(this.#root, state));
		actions.set("shop", new UpgradesActions(this.#root));
		actions.set("shape", new ShapeInfoActions(this.#root));
		actions.set("stats", new StatisticsActions(this.#root));
		actions.set("reward", new LevelRewardActions(this.#root));
		ActionsCollection.addActions(actions);
	}

	#announceOpening() {
		const welcomeMessage = "A map has loaded. Now you can play the game!";
		if (!this.#mod.trySendTutorialMessage(welcomeMessage)) {
			SdkClient.sendMessage(welcomeMessage);
		}
	}
}