import { SdkClient } from "../sdkClient";
import { StatusDisplay } from "../visuals/statusDisplay";
import { PlayGameActions } from "../actions/mainMenu/playGameActions";
import { ActionsCollection } from "../actions/base/actionsCollection";
import { DialogEvents } from "../events/dialogEvents";
import { ModSettings } from "../modSettings";

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
		DialogEvents.DIALOG_CLOSED.add("mainDialog", () => this.#onDialogClosed);
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
		ActionsCollection.deactivateActions(["play"], true);
		if (this.#timeout) {
			clearTimeout(this.#timeout);
		}
		DialogEvents.DIALOG_CLOSED.remove("mainDialog");
	}

	#onConnectedActions() {
		if (this.#open) {
			this.#tryOpenGame();
		}
	}

	#tryOpenGame() {
		if (ModSettings.get(ModSettings.KEYS.forceOpenMap)) {
			const seconds = ModSettings.get(ModSettings.KEYS.forcedMapTime);
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
		else if (ModSettings.get(ModSettings.KEYS.playerChooseMap)) {
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

	#onDialogClosed()
	{
		if (ModSettings.get(ModSettings.KEYS.playerChooseMap)) {
			ActionsCollection.activateActions(["play"]);
		}
	}
}