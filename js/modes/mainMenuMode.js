import { SdkClient } from "../sdkClient";
import { StatusDisplay } from "../visuals/statusDisplay";
import { PlayGameActions } from "../actions/mainMenu/playGameActions";
import { ActionsCollection } from "../actions/base/actionsCollection";
import { DialogEvents } from "../events/dialogEvents";
import { ModSettings } from "../modSettings";
import { MainExtrasActions } from "../actions/mainMenu/mainExtrasActions";

export class MainMenuMode {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {PlayGameActions} */ #playActions;
	/** @type {StatusDisplay} */ #StatusDisplay;
	/** @type {boolean} */ #open = false;
	/** @type {NodeJS.Timeout} */ #timeout;

	/** @param {import("shapez/mods/mod").Mod} mod */
	constructor(mod) {
		this.#mod = mod;
		this.#StatusDisplay = new StatusDisplay();
		SdkClient.connected.add("mainConn", () => this.#onConnectedActions());
	}

	/** @param {import("shapez/states/main_menu").MainMenuState} state */
	menuOpenned(state) {
		DialogEvents.DIALOG_CLOSED.add("mainDialog", () => { this.#onDialogClosed() });
		this.#open = true;
		this.#playActions = new PlayGameActions(this.#mod, state);
		this.#declareActions(state);
		const statusDisplayBox = this.#createStatusBox();
		this.#StatusDisplay.show(statusDisplayBox);

		if (SdkClient.isConnected()) {
			this.#onConnectedActions();
		}
		else if (ModSettings.get(ModSettings.KEYS.autoConnect)) {
			if (!SdkClient.isAttempting()) {
				this.#StatusDisplay.setText(
					"Connecting...", "attempting"
				);
				SdkClient.tryConnect(ModSettings.get(ModSettings.KEYS.socketURL));
			}
		}
	}

	menuClosed() {
		this.#open = false;
		ActionsCollection.deactivateActions(["play", "extras"], true);
		if (this.#timeout) {
			clearTimeout(this.#timeout);
		}
		DialogEvents.DIALOG_CLOSED.remove("mainDialog");
	}

	/** @param {import("shapez/states/main_menu").MainMenuState} state */
	#declareActions(state) {
		const actions = new Map();
		actions.set("play", this.#playActions);
		actions.set("extras", new MainExtrasActions(state));
		ActionsCollection.addActions(actions);
	}

	#onConnectedActions() {
		if (this.#open) {
			this.#tryOpenGame();
		}
		ActionsCollection.activateActions(["extras"]);
	}

	#tryOpenGame() {
		if (ModSettings.get(ModSettings.KEYS.forceOpenMap)) {
			const seconds = ModSettings.get(ModSettings.KEYS.forcedMapTime);
			if (seconds > 0) {
				this.#timeout = setTimeout(() => {
					this.#playActions.forcePlayMap();
					this.#timeout = null;
				}, seconds * 1000);
				SdkClient.sendMessage(`A map is going to be openned in ${seconds} seconds. Please wait.`, true);
			}
			else {
				this.#playActions.forcePlayMap();
			}
		}
		else if (ModSettings.get(ModSettings.KEYS.playerChooseMap)) {
			ActionsCollection.activateActions(["play"]);
		}
		else {
			SdkClient.sendMessage("The main menu is openned, but you have no permissions to open any map. Please wait till a human let's you play.", true);
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

	#onDialogClosed() {
		this.#onConnectedActions();
	}
}