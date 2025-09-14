import { ModSettings } from "../../modSettings";
import { ToggleSetting } from "../inputs/toggleSetting";

/**
 * Manages dangerous settings that reside in the SDK
 * @class DangerousSettings
 */
export class DangerousSettings {
	/** @type {ToggleSetting} */ #allowPauseToogle;
	/** @type {ToggleSetting} */ #allowExitToogle;
	/** @type {ToggleSetting} */ #allowCloseToogle;

	constructor() {}

	/** @param {ToggleSetting} toogleSetting */
	addAllowPauseToogle(toogleSetting) {
		this.#allowPauseToogle = toogleSetting;
		this.#allowPauseToogle.onClicked = () => {
			this.#onAllowPauseToogleClicked();
		};
		this.#allowPauseToogle.set(ModSettings.get(ModSettings.KEYS.allowPause));
	}

	/** @param {ToggleSetting} toogleSetting */
	addAllowExitToogle(toogleSetting) {
		this.#allowExitToogle = toogleSetting;
		this.#allowExitToogle.onClicked = () => {
			this.#onAllowExitToogleClicked();
		};
		this.#allowExitToogle.set(ModSettings.get(ModSettings.KEYS.allowExit));
	}

	/** @param {ToggleSetting} toogleSetting */
	addAllowCloseToogle(toogleSetting) {
		this.#allowCloseToogle = toogleSetting;
		this.#allowCloseToogle.onClicked = () => {
			this.#onAllowCloseToogleClicked();
		};
		this.#allowCloseToogle.set(ModSettings.get(ModSettings.KEYS.allowClose));
	}

	#saveSetting(key, value) {
		ModSettings.set(key, value);
		ModSettings.save();
	}

	#onAllowPauseToogleClicked() {
		const key = ModSettings.KEYS.allowPause;
		const value = ! ModSettings.get(key);
		this.#allowPauseToogle.set(value);
		this.#saveSetting(key, value);
	}

	#onAllowExitToogleClicked() {
		const key = ModSettings.KEYS.allowExit;
		const value = ! ModSettings.get(key);
		this.#allowExitToogle.set(value);
		this.#saveSetting(key, value);
	}

	#onAllowCloseToogleClicked() {
		const key = ModSettings.KEYS.allowClose;
		const value = ! ModSettings.get(key);
		this.#allowCloseToogle.set(value);
		this.#saveSetting(key, value);
	}
}