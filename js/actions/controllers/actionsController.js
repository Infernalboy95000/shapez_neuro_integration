import { SdkClient } from "../../sdkClient";
import { MainMenuActions } from "./mainMenuActions";
import { SettingsActions } from "./settingsActions";
import { SdkActionList } from "../sdkActionList";
/**
 * Listens and responds to all actions the SDK receives
 * @class ActionsListener
 */
export class ActionsController {
	/** @type {string} */ #stateKey;
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {MainMenuActions} */ #mainMenuActions;
	/** @type {SettingsActions} */ #settingsActions;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 */
	constructor(mod) {
		this.#mod = mod;
		this.#mainMenuActions = new MainMenuActions(mod);
		this.#settingsActions = new SettingsActions(mod);
		SdkClient.connected.add(() => { this.#onPlayerConnected()});
		SdkClient.action.add((e) => { this.#onPlayerAction(e)});
	}

	notifyStateChange(state) {
		this.#stateKey = state.key;
		switch (state.key) {
			case "MainMenuState":
				this.#mainMenuActions.menuOpenned(state);
				break;
			case "SettingsState":
				this.#settingsActions.menuOpenned();
				break;
			case "InGameState":
				// Way too temporal, but should ""work"" for now
				if (SdkClient.isConnected) {
					const actions = [SdkActionList.PLAY_GAME];
					SdkClient.removeActions(actions);
				}
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