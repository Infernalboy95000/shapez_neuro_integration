import { HUDShop } from "shapez/game/hud/parts/shop";
import { ActionsCollection } from "../actions/base/actionsCollection";
import { HUDShapeViewer } from "shapez/game/hud/parts/shape_viewer";
import { ShapeDefinition } from "shapez/game/shape_definition";
import { HUDStatistics } from "shapez/game/hud/parts/statistics";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { Stack } from "../custom/types/stack";
import { SdkClient } from "../sdkClient";
import { T } from "shapez/translations";

export class OverlayEvents {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ShapeDefinition} */ static lastShapeDescribed;
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
	}

	/** @param {import("shapez/game/root").GameRoot} root */
	updateRoot(root) {
		this.#root = root;
		root.hud.signals.unlockNotificationFinished.add(() => {this.#overlayClosed()});
		root.signals.storyGoalCompleted.add(this.#onStoryGoalCompleted, this);
	}

	#activateOverlay() {
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
			default:
				ActionsCollection.activateActions([
				"build", "delete", "scan", "camera", "pin", "tools", "overlay"
			]);
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
			default:
				ActionsCollection.deactivateActions([
				"build", "delete", "scan", "camera", "pin", "tools", "overlay"
			]);
		}
	}

	/** @param {string} overlay */
	#overlayOpened(overlay) {
		this.#deactivateOverlay();
		this.#overlays.push(overlay);
		this.#activateOverlay();
	}

	#overlayClosed() {
		this.#deactivateOverlay();
		this.#overlays.pop();
		this.#activateOverlay();
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