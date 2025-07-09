import { HUDInteractiveTutorial } from "shapez/game/hud/parts/interactive_tutorial";
import { SdkClient } from "../sdkClient";

export class TutorialMessager {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {boolean} */ #gameLoaded = false;
	/** @type {string} */ #message = "";

	/** @param {import("shapez/mods/mod").Mod} mod */
	constructor(mod) {
		const currentClass = this;
		this.#mod = mod;
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