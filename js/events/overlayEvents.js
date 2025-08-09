import { HUDShop } from "shapez/game/hud/parts/shop";
import { ActionsCollection } from "../actions/base/actionsCollection";
import { HUDShapeViewer } from "shapez/game/hud/parts/shape_viewer";
import { ShapeDefinition } from "shapez/game/shape_definition";
import { HUDStatistics } from "shapez/game/hud/parts/statistics";

export class OverlayEvents {
	/** @type {ShapeDefinition} */ static lastShapeDescribed;
	/** @type {string} */ #lastOverlay = "none";

	/** @param {import("../main").NeuroIntegration} mod */
	constructor(mod) {
		const thisClass = this;
		//this.#notificationActions.addAction(NotificationsActionList.CLOSE_NOTIFICATION);

		mod.modInterface.runAfterMethod( HUDShop, "show",
			function() { thisClass.#upgradesOpenned(); }
		);

		mod.modInterface.runAfterMethod( HUDShop, "close",
			function() { thisClass.#upgradesClosed(); }
		);

		mod.modInterface.runAfterMethod( HUDShapeViewer, "renderForShape",
			function(shape) {
				OverlayEvents.lastShapeDescribed = shape;
				thisClass.#fullShapeView();
			}
		);

		mod.modInterface.runAfterMethod( HUDShapeViewer, "close",
			function() { thisClass.#fullShapeClose(); }
		);

		mod.modInterface.runAfterMethod( HUDStatistics, "show",
			function() { thisClass.#statsOpenned(); }
		);

		mod.modInterface.runAfterMethod( HUDStatistics, "close",
			function() { thisClass.#statsClosed(); }
		);

		//this.#root.hud.signals.unlockNotificationFinished.add(() => {this.#testCrazy()});
		//this.#root.signals.storyGoalCompleted.add(this.#onStoryGoalCompleted, this);
	}

	#upgradesOpenned() {
		this.#lastOverlay = "shop";
		ActionsCollection.deactivateActions([
			"build", "delete", "scan", "camera", "pin", "tools", "overlay"
		]);
		ActionsCollection.activateActions(["shop"]);
	}

	#upgradesClosed() {
		this.#lastOverlay = "none";
		ActionsCollection.deactivateActions(["shop"]);
		ActionsCollection.activateActions([
			"build", "delete", "scan", "camera", "pin", "tools", "overlay"
		]);
	}

	#fullShapeView() {
		ActionsCollection.deactivateActions([
			"build", "delete", "scan", "camera", "pin", "tools", "overlay", "shop"
		]);
		ActionsCollection.activateActions(["shape"]);
	}

	#fullShapeClose() {
		ActionsCollection.deactivateActions(["shape"]);
		if (this.#lastOverlay == "shop") {
			ActionsCollection.activateActions(["shop"]);
		}
		else {
			ActionsCollection.activateActions([
				"build", "delete", "scan", "camera", "pin", "tools", "overlay"
			]);
		}
	}

	#statsOpenned() {
		this.#lastOverlay = "stats";
		ActionsCollection.deactivateActions([
			"build", "delete", "scan", "camera", "pin", "tools", "overlay"
		]);
		ActionsCollection.activateActions(["stats"]);
	}

	#statsClosed() {
		this.#lastOverlay = "none";
		ActionsCollection.deactivateActions(["stats"]);
		ActionsCollection.activateActions([
			"build", "delete", "scan", "camera", "pin", "tools", "overlay"
		]);
	}

	/**
	 * @param {number} level
	 * @param {enumHubGoalRewards} reward
	 */
	/*
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
	*/
}