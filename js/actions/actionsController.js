import { InGameState } from "shapez/states/ingame";
import { SdkClient } from "../sdkClient";
import { InGameActions } from "./main/inGameActions";
import { MainMenuActions } from "./main/mainMenuActions";
import { SettingsActions } from "./main/settingsActions";

/** Listens and responds to all actions the SDK receives */
export class ActionsController {
	/** @type {string} */ #stateKey;
	/** @type {import("../main").NeuroIntegration} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {MainMenuActions} */ #mainMenuActions;
	/** @type {SettingsActions} */ #settingsActions;
	/** @type {InGameActions} */ #inGameActions;
	/** @type {InGameState} */ #gameState;

	/** @param {import("../main").NeuroIntegration} mod */
	constructor(mod) {
		this.#mod = mod;
		this.#mainMenuActions = new MainMenuActions(mod);
		this.#settingsActions = new SettingsActions(mod);
		SdkClient.connected.add(() => { this.#onPlayerConnected()});
		SdkClient.action.add((e) => { this.#onPlayerAction(e)});
	}

	notifyStateChange(state) {
		this.#notifyCloseOfMenus();
		this.#stateKey = state.key;
		switch (state.key) {
			case "MainMenuState":
				this.#mainMenuActions.menuOpenned(state);
				break;
			case "SettingsState":
				this.#settingsActions.menuOpenned();
				break;
			case "InGameState":
				this.#gameState = state;
				if (this.#inGameActions) {
					this.#inGameActions.gameOpenned(state);
				}
				break;
		}
	}

	/** @param {import("shapez/game/root").GameRoot} root */
	newGameOpenned(root) {
		this.#inGameActions = new InGameActions(this.#mod, root);
		this.#inGameActions.gameOpenned(this.#gameState);
	}

	#notifyCloseOfMenus() {
		switch (this.#stateKey) {
			case "MainMenuState":
				this.#inGameActions = undefined;
				this.#mainMenuActions.menuClosed();
				break;
			case "InGameState":
				this.#inGameActions.gameClosed();
				break;
		}
	}

	#onPlayerConnected() {
		switch (this.#stateKey) {
			case "MainMenuState":
				break;
			case "SettingsState":
				this.#settingsActions.playerConntected();
				break;
		}
	}

	#onPlayerAction(action) {
		switch (this.#stateKey) {
			case "MainMenuState":
				this.#mainMenuActions.playerSentAction(action);
				break;
			case "SettingsState":
				this.#settingsActions.playerSentAction(action);
				break;
			case "InGameState":
				this.#inGameActions.playerSentAction(action);
				break;
			default:
				const menuName = this.#stateKey.slice(0, this.#stateKey.search("State"));
				this.#informNoControllOverMenu(action, menuName);
				break;
		}
	}

	/** @param {string} menuName */
	#informNoControllOverMenu(action, menuName) {
		SdkClient.tellActionResult(
			action.id, false,
			`You're on ${menuName}. ` +
			`You cannot perform actions in this menu beacuse it's not implemented. ` +
			`Please, wait till the menu has changed or tell a human to change it.`);
	}
}