import { ModSettings } from "../../modSettings";
import { NumberSetting } from "./../inputs/numberSetting";
import { OptionListSetting } from "./../inputs/optionListSetting";
import { ToggleSetting } from "./../inputs/toggleSetting";

/**
 * Manages settings related to startup actions
 * @class ConnextionSettings
 */
export class StartupSettings {
	/** @type {ToggleSetting} */ #autoConnectToggle;
	/** @type {ToggleSetting} */ #playerChooseMapToggle;
	/** @type {ToggleSetting} */ #forceOpenMapToggle;
	/** @type {NumberSetting} */ #forceOpenTimer;
	/** @type {OptionListSetting} */ #mapAwailableOptions;

	constructor() {}

	/** @param {ToggleSetting} toogleSetting */
	addAutoConnectToogle(toogleSetting) {
		this.#autoConnectToggle = toogleSetting;
		this.#setAutoConnectEvents();
		this.#autoConnectToggle.set(ModSettings.get(ModSettings.KEYS.autoConnect));
	}

	/** @param {ToggleSetting} toogleSetting */
	addPlayerChooseMapToggle(toogleSetting) {
		this.#playerChooseMapToggle = toogleSetting;
		this.#setPlayerChooseMapEvents();
		this.#playerChooseMapToggle.set(ModSettings.get(ModSettings.KEYS.playerChooseMap));
	}

	/** @param {ToggleSetting} toogleSetting */
	addForceOpenMapToggle(toogleSetting) {
		const forceMap = ModSettings.get(ModSettings.KEYS.forceOpenMap);
		const playerChoose = ModSettings.get(ModSettings.KEYS.playerChooseMap);

		this.#forceOpenMapToggle = toogleSetting;
		this.#setForceOpenMapEvents();

		// Player can choose and Force open are mutually exlusive
		if (forceMap && playerChoose) {
			this.#forceOpenMapToggle.set(false);
			this.#saveSetting(ModSettings.KEYS.forceOpenMap, false);
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

	#saveSetting(key, value) {
		ModSettings.set(key, value);
		ModSettings.save();
	}

	#onAutoConnectToogleClicked() {
		const key = ModSettings.KEYS.autoConnect;
		const value = !ModSettings.get(key);
		this.#autoConnectToggle.set(value);
		this.#saveSetting(key, value);
	}

	#onPlayerChooseMapToogleClicked() {
		const chooseKey = ModSettings.KEYS.playerChooseMap;
		const value = !ModSettings.get(chooseKey);
		this.#playerChooseMapToggle.set(value);
		this.#saveSetting(chooseKey, value);

		// Player can choose and Force open are mutually exlusive
		const forceKey = ModSettings.KEYS.forceOpenMap;
		if (ModSettings.get(forceKey)) {
			this.#forceOpenMapToggle.set(false);
			this.#saveSetting(forceKey, false);
		}
	}

	#onForceOpenMapToogleClicked() {
		const forceKey = ModSettings.KEYS.forceOpenMap;
		const value = !ModSettings.get(forceKey);
		this.#forceOpenMapToggle.set(value);
		this.#saveSetting(forceKey, value);

		// Player can choose and Force open are mutually exlusive
		const chooseKey = ModSettings.KEYS.playerChooseMap;
		if (ModSettings.get(chooseKey)) {
			this.#playerChooseMapToggle.set(false);
			this.#saveSetting(chooseKey, false);
		}
	}

	#onForceTimerDragEnded(value) {
		this.#saveSetting(ModSettings.KEYS.forcedMapTime, value);
	}

	#onMapAvailableOptionChosed(optionID) {
		this.#saveSetting(ModSettings.KEYS.mapAvailable, optionID);
	}
}