import { SdkClient } from "../../sdkClient";
import { StatusDisplay } from "../../visuals/statusDisplay";
import { PlayGameActions } from "../mainMenu/playGameActions";
import { BaseActions } from "../baseActions";

export class MainMenuActions {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {PlayGameActions} */ #playGameActions;
	/** @type {Array<BaseActions>} */ #actioners;
	/** @type {StatusDisplay} */ #StatusDisplay;
	/** @type {boolean} */ #open = false;
	/** @type {number} */ #timeout;

	/** @param {import("shapez/mods/mod").Mod} mod */
	constructor(mod) {
		this.#mod = mod;
		this.#StatusDisplay = new StatusDisplay();
		SdkClient.connected.add(() => this.#onConnectedActions());
	}

	/** @param {import("shapez/states/main_menu").MainMenuState} state */
	menuOpenned(state) {
		this.#open = true;
		this.#playGameActions = new PlayGameActions(this.#mod, state);
		this.#actioners = [
			this.#playGameActions
		];

		const statusDisplayBox = this.#createStatusBox();
		this.#StatusDisplay.show(statusDisplayBox);

		if (SdkClient.isConnected()) {
			this.#onConnectedActions();
		}
		else if (this.#mod.settings.autoConnect) {
			if (!SdkClient.isAttempting()) {
				this.#StatusDisplay.setText(
					"Connecting...", "attempting"
				);
				SdkClient.tryConnect(this.#mod.settings.socketURL);
			}
		}
	}

	menuClosed() {
		this.#open = false;
		this.#deactivateActions();
		if (this.#timeout) {
			clearTimeout(this.#timeout);
		}
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

	#onConnectedActions() {
		if (this.#open) {
			this.#tryOpenGame();
		}
	}

	#tryOpenGame() {
		if (this.#mod.settings.forceOpenMap) {
			const seconds = this.#mod.settings.forcedMapTime;
			if (seconds > 0) {
				this.#timeout = setTimeout(() => {
					this.#playGameActions.forcePlayMap();
					this.#timeout = null;
				}, seconds * 1000);
			}
			else {
				this.#playGameActions.forcePlayMap();
			}
		}
		else if (this.#mod.settings.playerChooseMap) {
			this.#activateActions();
		}
	}

	/** @returns {HTMLDivElement} */
	#createStatusBox() {
		const parent = document.querySelector(".sideContainer");
		const statusDisplay = document.createElement("div");
		statusDisplay.className = "sdkStatusDisplay";
		parent.appendChild(statusDisplay);

		const header = document.createElement("div");
		header.className = "header";
		statusDisplay.appendChild(header);

		const title = document.createElement("h3");
		title.textContent = "Sdk Status";
		header.appendChild(title);

		return statusDisplay;
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
}