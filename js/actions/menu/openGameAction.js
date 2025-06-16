import { SdkClient } from "../../sdkClient";
import { SettingsMenu } from "../../settings/settingsMenu";
import { SimpleSdkAction } from "../definitions/simpleSdkAction";
import { SdkActionList } from "../sdkActionList";

export class OpenGameAction {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;

	/** @param {import("shapez/mods/mod").Mod} mod */
	constructor(mod) {
		this.#mod = mod;
	}

	promptMapToPlayer() {
		const actions = [];
		const options = this.#getAvailableOptions();
		if (options.length == 1) {
			actions.push(new SimpleSdkAction(
				SdkActionList.PLAY_GAME,
				"Play the game"
			));
			SdkClient.registerActions(actions);
		}
		SdkClient.sendMessage("You can play the game now, if you want.");
	}

	/** @param {import("shapez/states/main_menu").MainMenuState} state */
	forceChosenMap(state) {
		const options = this.#getAvailableOptions();
		const random = Math.floor(Math.random() * options.length);

		if (options[random] == SettingsMenu.LAST_MAP) {
			state.onContinueButtonClicked();
		}
		else if (options[random] == SettingsMenu.NEW_MAP) {
			state.onPlayButtonClicked();
		}
		else {
			const metaData = this.#mod.app.savegameMgr.
				getGameMetaDataByInternalId(options[random]);
			state.resumeGame(metaData);
		}
	}

	/**
	 * @param {import("shapez/states/main_menu").MainMenuState} state
	 * @returns {boolean}
	 */
	tryContinueLastMap(state) {
		let mapOpenned = true;
		state.onContinueButtonClicked();
		return mapOpenned;
	}

	/**
	 * @param {import("shapez/states/main_menu").MainMenuState} state
	 * @returns {boolean}
	 */
	tryCreateNewMap(state) {
		let mapCreated = true;
		state.onPlayButtonClicked();
		return mapCreated;
	}

	/** 
	 * @param {string} mapName
	 * @param {import("shapez/states/main_menu").MainMenuState} state
	 * @returns {boolean}
	 */
	tryOpenMap(mapName, state) {
		let mapOpenned = true;
		const metaData = this.#getMapFromName(mapName);
		if (metaData != null) {
			state.resumeGame(metaData);
		}
		else {
			mapOpenned = false;
		}
		return mapOpenned;
	}

	/** 
	 * @param {string} mapID
	 * @param {import("shapez/states/main_menu").MainMenuState} state
	 * @returns {boolean}
	 */
	tryOpenMapID(mapID, state) {
		let mapOpenned = true;
		const metaData = this.#mod.app.savegameMgr.getGameMetaDataByInternalId(mapID);
		if (metaData != null) {
			state.resumeGame(metaData);
		}
		else {
			mapOpenned = false;
		}
		return mapOpenned;
	}

	/** @returns {Array<string>} */
	#getAvailableOptions() {
		const options = [];
		const allowedMap = this.#mod.settings.mapAvailable;
		const saves = this.#mod.app.savegameMgr.getSavegamesMetaData();

		if (allowedMap == SettingsMenu.LAST_MAP) {
			if (saves.length > 0) {
				options.push(SettingsMenu.LAST_MAP);
			}
			else {
				options.push(SettingsMenu.NEW_MAP);
			}
		}
		else if (allowedMap == SettingsMenu.NEW_MAP) {
			options.push(SettingsMenu.NEW_MAP);
		}
		else if (
			allowedMap == SettingsMenu.ANY_MAP ||
			allowedMap == SettingsMenu.ANY_OPTION
		) {
			for (let i = 0; i < saves.length; i++) {
				options.push(saves[i].internalId);
			}

			if (allowedMap == SettingsMenu.ANY_OPTION) {
				options.push(SettingsMenu.NEW_MAP);
				if (saves.length > 0) {
					options.push(SettingsMenu.LAST_MAP);
				}
			}
		}
		else {
			options.push(allowedMap);
		}

		return options;
	}

	/**
	 * @param {string} mapName
	 * @returns {import("shapez/savegame/savegame_typedefs").SavegameMetadata}
	 */
	#getMapFromName(mapName) {
		const saves = this.#mod.app.savegameMgr.getSavegamesMetaData();
		let mapID = "";

		for (let i = 0; i < saves.length; i++) {
			if (saves[i].name == mapName) {
				mapID = saves[i].internalId;
			}
		}

		if (mapID == "") {
			return null;
		}
		else {
			return this.#mod.app.savegameMgr.getGameMetaDataByInternalId(mapID);
		}
	}
}