import { HUDShop } from "shapez/game/hud/parts/shop";
import { ActionsCollection } from "../actions/base/actionsCollection";

export class OverlayEvents {
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

			//this.#root.hud.signals.unlockNotificationFinished.add(() => {this.#testCrazy()});
			//this.#root.signals.storyGoalCompleted.add(this.#onStoryGoalCompleted, this);
		}

		#upgradesOpenned() {
			ActionsCollection.deactivateActions([
				"build", "delete", "scan", "camera", "pin", "tools", "overlay"
			])
			ActionsCollection.activateActions(["shop"]);
		}

		#upgradesClosed() {
			ActionsCollection.deactivateActions(["shop"]);
			ActionsCollection.activateActions([
				"build", "delete", "scan", "camera", "pin", "tools", "overlay"
			])
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