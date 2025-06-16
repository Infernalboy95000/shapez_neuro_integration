import { SdkClient } from "../../sdkClient";
import { SettingsMenu } from "../../settings/settingsMenu";
import { OpenGameAction } from "../menu/openGameAction";
import { SdkActionList } from "../sdkActionList";

export class MainMenuActions {
	/** @type {import("shapez/states/main_menu").MainMenuState} */ #state;
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {OpenGameAction} */ #openGameAction;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 */
	constructor(mod) {
		this.#mod = mod;
		this.#openGameAction = new OpenGameAction(mod);
	}

	/** @param {import("shapez/states/main_menu").MainMenuState} state */
	menuOpenned(state) {
		this.#state = state;
		if (SdkClient.isConnected()) {
			this.#tryOpenGame();
		}
	}

	playerSentAction(action) {
		console.log(action);
		if (action.name === SdkActionList.PLAY_GAME) {
			if (this.#playerTriesToPlay()) {
				SdkClient.tellActionResult(
					action.id, true,
					`The map is loading. ` +
					`Please, wait. This usually takes an instant.`
				)
			}
			else {
				SdkClient.tellActionResult(
					action.id, false,
					`Error loading the map.`
				)
			}
		}
		else {
			SdkClient.tellActionResult(
				action.id, false,
				`Unknown action.`
			)
		}
	}

	/** @returns {boolean} */
	#playerTriesToPlay() {
		return this.#tryPlayMap(this.#mod.settings.mapAvailable);
	}

	/**
	 * @param {string} mapName
	 * @returns {boolean}
	 */
	#playerTriesToOpenMap(mapName) {
		return this.#tryPlayMap(mapName);
	}

	#tryOpenGame() {
		if (this.#mod.settings.forceOpenMap) {
			this.#openGameAction.forceChosenMap(this.#state);
		}
		else if (this.#mod.settings.playerChooseMap) {
			this.#openGameAction.promptMapToPlayer();
		}
	}

	/**
	 * @param {string} mapOption
	 * @returns {boolean}
	 */
	#tryPlayMap(mapOption) {
		if (mapOption == SettingsMenu.LAST_MAP) {
			return this.#openGameAction.tryContinueLastMap(this.#state);
		}
		else if (mapOption == SettingsMenu.NEW_MAP) {
			return this.#openGameAction.tryCreateNewMap(this.#state);
		}
		else if (mapOption.length > 20) {
			return this.#openGameAction.tryOpenMapID(mapOption, this.#state);
		}
		else {
			return this.#openGameAction.tryOpenMap(mapOption,this.#state);
		}
	}
}