import { NumberSetting } from "./inputs/numberSetting";
import { OptionListSetting } from "./inputs/optionListSetting";
import { ToggleSetting } from "./inputs/toggleSetting";

/**
 * Manages settings related to startup actions
 * @class ConnextionSettings
 */
export class StartupSettings {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {ToggleSetting} */ #autoConnectToggle;
	/** @type {ToggleSetting} */ #playerChooseMapToggle;
	/** @type {ToggleSetting} */ #forceOpenMapToggle;
	/** @type {NumberSetting} */ #forceOpenTimer;
	/** @type {OptionListSetting} */ #mapAwailableOptions;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 */
	constructor(mod) {
		this.#mod = mod;
	}

	/** @param {ToggleSetting} toogleSetting */
	addAutoConnectToogle(toogleSetting) {
		this.#autoConnectToggle = toogleSetting;
		this.#setAutoConnectEvents();
		this.#autoConnectToggle.set(this.#mod.settings.autoConnect);
	}

	/** @param {ToggleSetting} toogleSetting */
	addPlayerChooseMapToggle(toogleSetting) {
		this.#playerChooseMapToggle = toogleSetting;
		this.#setPlayerChooseMapEvents();
		this.#playerChooseMapToggle.set(this.#mod.settings.playerChooseMap);
	}

	/** @param {ToggleSetting} toogleSetting */
	addForceOpenMapToggle(toogleSetting) {
		const forceMap = this.#mod.settings.forceOpenMap;
		const playerChoose = this.#mod.settings.playerChooseMap;

		this.#forceOpenMapToggle = toogleSetting;
		this.#setForceOpenMapEvents();

		// Player can choose and Force open are mutually exlusive
		if (forceMap && playerChoose) {
			this.#forceOpenMapToggle.set(false);
			this.#saveForceOpenMapSetting(false);
		}
		else {
			this.#forceOpenMapToggle.set(forceMap);
		}
	}

	/** @param {NumberSetting} numberSetting */
	addForceMapTimer(numberSetting) {
		this.#forceOpenTimer = numberSetting;
		this.#setForceTimerEvents();
	}

	/** @param {OptionListSetting} optionListSetting */
	addMapAvailableOptions(optionListSetting, options) {
		this.#mapAwailableOptions = optionListSetting;
		this.#setMapAvailableEvents();
	}

	#setAutoConnectEvents() {
		this.#autoConnectToggle.onClicked = () => {
			this.#onAutoConnectToogleClicked()
		};
	}

	#setPlayerChooseMapEvents() {
		this.#playerChooseMapToggle.onClicked = () => {
			this.#onPlayerChooseMapToogleClicked()
		};
	}

	#setForceOpenMapEvents() {
		this.#forceOpenMapToggle.onClicked = () => {
			this.#onForceOpenMapToogleClicked()
		};
	}

	#setForceTimerEvents() {
		this.#forceOpenTimer.onDragEnded = (e) => {
			this.#onForceTimerDragEnded(e)
		};
	}

	#setMapAvailableEvents() {
		this.#mapAwailableOptions.onOptionChoosed = (optionID) => {
			this.#onMapAvailableOptionChosed(optionID)
		}
	}

	#saveAutoConnectSetting(value) {
		this.#mod.settings.autoConnect = value;
		this.#mod.saveSettings();
	}

	#savePlayerChooseMapSetting(value) {
		this.#mod.settings.playerChooseMap = value;
		this.#mod.saveSettings();
	}

	#saveForceOpenMapSetting(value) {
		this.#mod.settings.forceOpenMap = value;
		this.#mod.saveSettings();
	}

	#saveForceOpenTimerSetting(value) {
		this.#mod.settings.forcedMapTime = value;
		this.#mod.saveSettings();
	}

	#saveMapAvailableSetting(value) {
		this.#mod.settings.mapAvailable = value;
		this.#mod.saveSettings();
	}

	#onAutoConnectToogleClicked() {
		const value = !this.#mod.settings.autoConnect;
		this.#autoConnectToggle.set(value);
		this.#saveAutoConnectSetting(value);
	}

	#onPlayerChooseMapToogleClicked() {
		const value = !this.#mod.settings.playerChooseMap;
		this.#playerChooseMapToggle.set(value);
		this.#savePlayerChooseMapSetting(value);

		// Player can choose and Force open are mutually exlusive
		if (this.#mod.settings.forceOpenMap) {
			this.#forceOpenMapToggle.set(false);
			this.#saveForceOpenMapSetting(false);
		}
	}

	#onForceOpenMapToogleClicked() {
		const value = !this.#mod.settings.forceOpenMap;
		this.#forceOpenMapToggle.set(value);
		this.#saveForceOpenMapSetting(value);

		// Player can choose and Force open are mutually exlusive
		if (this.#mod.settings.playerChooseMap) {
			this.#playerChooseMapToggle.set(false);
			this.#savePlayerChooseMapSetting(false);
		}
	}

	#onForceTimerDragEnded(value) {
		this.#saveForceOpenTimerSetting(value);
	}

	#onMapAvailableOptionChosed(optionID) {
		this.#saveMapAvailableSetting(optionID);
	}
}