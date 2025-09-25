import { HUDInteractiveTutorial } from "shapez/game/hud/parts/interactive_tutorial";
import { SdkClient } from "../sdkClient";
import { TutorialList } from "./tutorialList";
import { waitNextFrame } from "shapez/core/utils";
import { DialogEvents } from "../events/dialogEvents";
import { OverlayEvents } from "../events/overlayEvents";
import { HUDUnlockNotification } from "shapez/game/hud/parts/unlock_notification";
import { T } from "shapez/translations";

export class TutorialMessager {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {boolean} */ #gameOpenned = false;
	/** @type {boolean} */ #gameLoaded = false;
	/** @type {string} */ #queuedMessage = null;

	/** @param {import("shapez/mods/mod").Mod} mod */
	constructor(mod) {
		const currentClass = this;
		this.#mod = mod;
		DialogEvents.DIALOG_CLOSED.add("tutorialListenDialog", () => {
			this.#trySendQueuedMessage();
		});

		OverlayEvents.OVERLAYS_CLOSED.add("tutorialListenOverlays", () => {
			this.#trySendQueuedMessage();
		});

		this.#replaceUpdateTutorial();
		this.#replaceCloseNotification();

		this.#mod.modInterface.runAfterMethod(
			HUDInteractiveTutorial,
			"onHintChanged",
			function(hintId) {
				const info = `Tutorial: ` +
				`${this.elementDescription.textContent}`
				currentClass.#trySendMessage(info);
			}
		);
	}

	notifyGameOpenned() {
		this.#gameOpenned = true;
		this.#trySendQueuedMessage();
	}

	notifyStateChange(state) {
		if (state.key == "InGameState") {
			this.#gameLoaded = true;
			this.#trySendQueuedMessage();
		}
		else {
			this.#gameLoaded = false;
		}

		if (state.key == "MainMenuState") {
			this.#gameOpenned = false;
		}
	}

	#replaceUpdateTutorial() {
		this.#mod.modInterface.replaceMethod(
			HUDInteractiveTutorial,
			"update",
			function() {
				// Compute current hint
				const thisLevelHints = TutorialList.tutorialsByLevel[this.root.hubGoals.level - 1];
				let targetHintId = null;

				if (thisLevelHints) {
					for (let i = 0; i < thisLevelHints.length; ++i) {
						const hint = thisLevelHints[i];
						if (hint.condition(this.root)) {
							targetHintId = hint.id;
							break;
						}
					}
				}
				this.currentHintId.set(targetHintId);
				this.domAttach.update(!!targetHintId);
			}
		)
	}

	#replaceCloseNotification() {
		this.#mod.modInterface.replaceMethod(
			HUDUnlockNotification,
			"requestClose",
			function() {
				this.root.app.adProvider.showVideoAd().then(() => {
				this.close();

				this.root.hud.signals.unlockNotificationFinished.dispatch();

				if (
					this.root.hubGoals.level > this.root.gameMode.getLevelDefinitions().length - 1 &&
					this.root.app.restrictionMgr.getIsStandaloneMarketingActive()
				) {
					// @ts-ignore
					this.root.hud.parts.standaloneAdvantages.show(true);
				}

				if (!this.root.app.settings.getAllSettings().offerHints) {
					return;
				}

				if (this.root.hubGoals.level === 3) {
					// @ts-ignore
					const { showUpgrades } = this.root.hud.parts.dialogs.showInfo(
						T.dialogs.upgradesIntroduction.title,
						T.dialogs.upgradesIntroduction.desc,
						["showUpgrades:good:timeout"]
					);
					// @ts-ignore
					showUpgrades.add(() => this.root.hud.parts.shop.show());
				}
			});
			}
		);
	}

	/**
	 * @param {string} message
	 * */
	#trySendMessage(message) {
		waitNextFrame().then(() => {
			if (
				this.#gameLoaded &&
				this.#gameOpenned &&
				!DialogEvents.dialogOpen &&
				OverlayEvents.currentOverlay == null
			) {
				SdkClient.sendMessage(message);
			}
			else {
				this.#queuedMessage = message;
			}
		});
	}

	#trySendQueuedMessage() {
		if (this.#queuedMessage != null) {
			if (!DialogEvents.dialogOpen && OverlayEvents.currentOverlay == null) {
				SdkClient.sendMessage(this.#queuedMessage);
				this.#queuedMessage = null;
			}
		}
	}
}