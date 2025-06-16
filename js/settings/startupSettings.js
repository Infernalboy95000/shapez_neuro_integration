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
		this.#forceOpenMapToggle = toogleSetting;
		this.#setForceOpenMapEvents();
		this.#forceOpenMapToggle.set(this.#mod.settings.forceOpenMap);
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

	#saveMapAvailableSetting(value) {
		console.log("Original value: " + this.#mod.settings.mapAvailable);
		console.log("New value: " + value);
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
	}

	#onForceOpenMapToogleClicked() {
		const value = !this.#mod.settings.forceOpenMap;
		this.#forceOpenMapToggle.set(value);
		this.#saveForceOpenMapSetting(value);
	}

	#onMapAvailableOptionChosed(optionID) {
		this.#saveMapAvailableSetting(optionID);
	}
}