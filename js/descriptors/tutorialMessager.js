import { HUDInteractiveTutorial } from "shapez/game/hud/parts/interactive_tutorial";
import { SdkClient } from "../sdkClient";
import { TutorialList } from "./tutorialList";

export class TutorialMessager {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {boolean} */ #gameLoaded = false;
	/** @type {string} */ #message = "";

	/** @param {import("shapez/mods/mod").Mod} mod */
	constructor(mod) {
		const currentClass = this;
		this.#mod = mod;

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

	/**
	 * @param {string} message
	 * @returns {boolean}
	 * */
	TryAnnounceWithTutorial(message) {
		this.#gameLoaded = true;
		if (this.#message != "") {
			const msg = `${message} ${this.#message}`;
			this.#message = "";
			return (this.#trySendMessage(msg));
		}
		else {
			return false;
		}
	}

	notifyStateChange(state) {
		if (state.key != "InGameState") {
			this.#gameLoaded = false;
		}
	}

	/**
	 * @param {string} message
	 * @returns {boolean}
	 * */
	#trySendMessage(message) {
		if (this.#gameLoaded) {
			SdkClient.sendMessage(message);
			return true;
		}
		else {
			this.#message = message;
			return false;
		}
	}
}