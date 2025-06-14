import { NeuroListener } from "../../neuroListener";
import { SettingsMenu } from "../../settings/settingsMenu";

export class OpenGameAction {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {import("shapez/states/main_menu").MainMenuState} */ #state;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {import("shapez/states/main_menu").MainMenuState} state
	 */
	constructor(mod, root, state) {
		this.#mod = mod;
		this.#root = root;
		this.#state = state;

		this.#tryOpenGame();
	}

	#tryOpenGame() {
		if (NeuroListener.isConnected()) {
			if (this.#mod.settings.forceOpenMap) {
				this.#forceChosenMap();
			}
			else if (this.#mod.settings.playerChooseMap) {

			}
		}
	}

	/** @returns {Array<string>} */
	#getAvailableOptions() {
		const options = [];
		const allowedMap = this.#mod.settings.mapAvailable;
		const saves = this.#state.savedGames;

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

	#forceChosenMap() {
		const options = this.#getAvailableOptions();
		const random = Math.floor(Math.random() * options.length);

		if (options[random] == SettingsMenu.LAST_MAP) {
			this.#state.onContinueButtonClicked();
		}
		else if (options[random] == SettingsMenu.NEW_MAP) {
			this.#state.onPlayButtonClicked();
		}
		else {
			const metaData = this.#mod.app.savegameMgr.
				getGameMetaDataByInternalId(options[random]);
			this.#state.resumeGame(metaData);
		}
	}
}