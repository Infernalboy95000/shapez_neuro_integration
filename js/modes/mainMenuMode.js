import { SdkClient } from "../sdkClient";
import { StatusDisplay } from "../visuals/statusDisplay";
import { PlayGameActions } from "../actions/mainMenu/playGameActions";
import { ActionsCollection } from "../actions/base/actionsCollection";

export class MainMenuMode {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {PlayGameActions} */ #playActions;
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
		this.#playActions = new PlayGameActions(this.#mod, state);
		ActionsCollection.addActions(new Map([
			["play", this.#playActions]
		]));

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
		ActionsCollection.deactivateActions(["play"], true);
		if (this.#timeout) {
			clearTimeout(this.#timeout);
		}
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
					this.#playActions.forcePlayMap();
					this.#timeout = null;
				}, seconds * 1000);
			}
			else {
				this.#playActions.forcePlayMap();
			}
		}
		else if (this.#mod.settings.playerChooseMap) {
			ActionsCollection.activateActions(["play"]);
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
}