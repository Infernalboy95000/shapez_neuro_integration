import { HUDShop } from "shapez/game/hud/parts/shop";
import { ActionsCollection } from "../actions/base/actionsCollection";
import { HUDShapeViewer } from "shapez/game/hud/parts/shape_viewer";
import { ShapeDefinition } from "shapez/game/shape_definition";
import { HUDStatistics } from "shapez/game/hud/parts/statistics";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { Stack } from "../custom/types/stack";
import { SdkClient } from "../sdkClient";
import { T } from "shapez/translations";
import { HUDSettingsMenu } from "shapez/game/hud/parts/settings_menu";
import { ActionEvent } from "../custom/actionEvent";
import { DialogEvents } from "./dialogEvents";

export class OverlayEvents {
	/** @type {ActionEvent} */ static OVERLAYS_CLOSED = new ActionEvent();
	/** @type {string} */ static currentOverlay;
	/** @type {ShapeDefinition} */ static lastShapeDescribed;

	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {Stack} */ #overlays = new Stack();

	/** @param {import("../main").NeuroIntegration} mod */
	constructor(mod) {
		const thisClass = this;
		mod.modInterface.runAfterMethod( HUDShop, "show",
			function() { thisClass.#overlayOpened("shop"); }
		);

		mod.modInterface.runAfterMethod( HUDShop, "close",
			function() { thisClass.#overlayClosed(); }
		);

		mod.modInterface.runAfterMethod( HUDShapeViewer, "renderForShape",
			function(shape) {
				OverlayEvents.lastShapeDescribed = shape;
				thisClass.#overlayOpened("shape");
			}
		);

		mod.modInterface.runAfterMethod( HUDShapeViewer, "close",
			function() { thisClass.#overlayClosed(); }
		);

		mod.modInterface.runAfterMethod( HUDStatistics, "show",
			function() { thisClass.#overlayOpened("stats"); }
		);

		mod.modInterface.runAfterMethod( HUDStatistics, "close",
			function() { thisClass.#overlayClosed(); }
		);

		mod.modInterface.runAfterMethod ( HUDSettingsMenu, "show",
			function() { thisClass.#overlayOpened("pause"); }
		);

		mod.modInterface.runAfterMethod ( HUDSettingsMenu, "close",
			function() { thisClass.#overlayClosed(); }
		);
	}

	/** @param {import("shapez/game/root").GameRoot} root */
	updateRoot(root) {
		this.#root = root;
		root.hud.signals.unlockNotificationFinished.add(() => {this.#overlayClosed()});
		root.signals.storyGoalCompleted.add(this.#onStoryGoalCompleted, this);
		DialogEvents.DIALOG_CLOSED.add("overlayDialog", () => { this.#activateOverlay() });
	}

	#activateOverlay() {
		console.log("Is this working?");
		const overlay = this.#overlays.peek();
		switch (overlay) {
			case "shop":
				ActionsCollection.activateActions(["shop"]);
				break;
			case "shape":
				ActionsCollection.activateActions(["shape"]);
				break;
			case "stats":
				ActionsCollection.activateActions(["stats"]);
				break;
			case "reward":
				ActionsCollection.activateActions(["reward"]);
				break;
			case "pause":
				ActionsCollection.activateActions(["pause"]);
				break;
			default:
				OverlayEvents.OVERLAYS_CLOSED.invoke();
				break;
		}
	}

	#deactivateOverlay() {
		const overlay = this.#overlays.peek();
		switch (overlay) {
			case "shop":
				ActionsCollection.deactivateActions(["shop"]);
				break;
			case "shape":
				ActionsCollection.deactivateActions(["shape"]);
				break;
			case "stats":
				ActionsCollection.deactivateActions(["stats"]);
				break;
			case "reward":
				ActionsCollection.deactivateActions(["reward"]);
				break;
			case "pause":
				ActionsCollection.deactivateActions(["pause"]);
				break;
			default:
				ActionsCollection.deactivateActions([
					"build", "delete", "massDelete", "scan", "camera", "pin", "tools", "overlay"
				]);
				break;
		}
	}

	/** @param {string} overlay */
	#overlayOpened(overlay) {
		this.#deactivateOverlay();
		this.#overlays.push(overlay);
		this.#activateOverlay();
		OverlayEvents.currentOverlay = overlay;
	}

	#overlayClosed() {
		this.#deactivateOverlay();
		this.#overlays.pop();
		this.#activateOverlay();
		OverlayEvents.currentOverlay = this.#overlays.peek();
	}

	/**
	 * @param {number} level
	 * @param {enumHubGoalRewards} reward
	 */
	#onStoryGoalCompleted(level, reward) {
		const levels = this.#root.gameMode.getLevelDefinitions();

		if (level <= levels.length) {
			const desc = T.storyRewards[reward].desc;
			const descText = desc.replace(/<\s*br[^>]?>/,'\n').replace(/<[^>]*>/g,"");
			this.#overlayOpened("reward");
			SdkClient.sendMessage(
				`Level ${level} completed! \r\n` +
				`${descText}`
			)
		}
		else {
			SdkClient.sendMessage(
				`Level ${level} completed! Good luck on your next piece.`
			)
		}
	}
}