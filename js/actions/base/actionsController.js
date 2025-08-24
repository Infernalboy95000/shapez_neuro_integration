import { InGameState } from "shapez/states/ingame";
import { SdkClient } from "../../sdkClient";
import { InGameMode } from "../../modes/inGameMode";
import { MainMenuMode } from "../../modes/mainMenuMode";
import { SettingsMode } from "../../modes/settingsMode";
import { ActionsCollection } from "./actionsCollection";

/** Listens and responds to all actions the SDK receives */
export class ActionsController {
	/** @type {string} */ #stateKey;
	/** @type {import("../../main").NeuroIntegration} */ #mod;
	/** @type {MainMenuMode} */ #MainMenuMode;
	/** @type {SettingsMode} */ #SettingsMode;
	/** @type {InGameMode} */ #InGameMode;
	/** @type {InGameState} */ #gameState;

	/** @param {import("../../main").NeuroIntegration} mod */
	constructor(mod) {
		this.#mod = mod;
		this.#MainMenuMode = new MainMenuMode(mod);
		this.#SettingsMode = new SettingsMode(mod);
		SdkClient.connected.add("actCtrCon", () => { this.#onPlayerConnected()});
		SdkClient.action.add("actCtrAct", (e) => { this.#onPlayerAction(e)});
	}

	notifyStateChange(state) {
		this.#notifyCloseOfMenus();
		this.#stateKey = state.key;
		switch (state.key) {
			case "MainMenuState":
				this.#MainMenuMode.menuOpenned(state);
				break;
			case "SettingsState":
				this.#SettingsMode.menuOpenned();
				break;
			case "InGameState":
				this.#gameState = state;
				if (this.#InGameMode) {
					this.#InGameMode.gameOpenned(state);
				}
				break;
		}
	}

	/** @param {import("shapez/game/root").GameRoot} root */
	newGameOpenned(root) {
		this.#InGameMode = new InGameMode(this.#mod, root);
		this.#InGameMode.gameOpenned(this.#gameState);
	}

	#notifyCloseOfMenus() {
		switch (this.#stateKey) {
			case "MainMenuState":
				this.#InGameMode = undefined;
				this.#MainMenuMode.menuClosed();
				break;
			case "InGameState":
				this.#InGameMode.gameClosed();
				break;
		}
	}

	#onPlayerConnected() {
		switch (this.#stateKey) {
			case "MainMenuState":
				break;
			case "SettingsState":
				this.#SettingsMode.playerConntected();
				break;
		}
	}

	#onPlayerAction(action) {
		const menuName = this.#stateKey.slice(0, this.#stateKey.search("State"));
		let result = {valid:false, msg:this.#noControllMenuMsg(menuName)}
		switch (this.#stateKey) {
			case "MainMenuState":
			case "InGameState":
				result = ActionsCollection.tryPlayerAction(action);
				break;
			case "SettingsState":
				this.#SettingsMode.playerSentAction(action);
				break;
		}
		SdkClient.tellActionResult(action.id, result.valid, result.msg);
	}

	/** @param {string} menuName */
	#noControllMenuMsg(menuName) {
		return `You cannot perform actions in ${menuName}. ` +
		`Please wait till the menu changes.`;
	}
}