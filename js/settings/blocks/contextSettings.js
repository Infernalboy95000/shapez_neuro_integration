import { ModSettings } from "../../modSettings";
import { NumberSetting } from "./../inputs/numberSetting";
import { ToggleSetting } from "./../inputs/toggleSetting";

/**
 * Manages settings related to the SDK context
 * @class ContextSettings
 */
export class ContextSettings {
	/** @type {ToggleSetting} */ #coordsGridToogle;
	/** @type {ToggleSetting} */ #descriptiveActionsToogle;
	/** @type {NumberSetting} */ #waitAfterHumanNumber;

	constructor() {}

	/** @param {ToggleSetting} toogleSetting */
	addCorodsGridToogle(toogleSetting) {
		this.#coordsGridToogle = toogleSetting;
		this.#coordsGridToogle.onClicked = () => {
			this.#onCoordsGridToogleClicked();
		};
		this.#coordsGridToogle.set(ModSettings.get(ModSettings.KEYS.coordsGrid));
	}

	/** @param {NumberSetting} numberSetting */
	addWaitAfterHumanNumber(numberSetting) {
		this.#waitAfterHumanNumber = numberSetting;
		this.#waitAfterHumanNumber.onDragEnded = (e) => {
			this.#onWaitAfterHumanNumberDragEnded(e);
		};
	}

	/** @param {ToggleSetting} toogleSetting */
	addDescriptiveActionsToogle(toogleSetting) {
		this.#descriptiveActionsToogle = toogleSetting;
		this.#coordsGridToogle.onClicked = () => {
			this.#onDescriptiveActionsToogleClicked();
		};
		this.#descriptiveActionsToogle.set(ModSettings.get(ModSettings.KEYS.descriptiveActions));
	}

	#saveSetting(key, value) {
		ModSettings.set(key, value);
		ModSettings.save();
	}

	#onCoordsGridToogleClicked() {
		const key = ModSettings.KEYS.coordsGrid;
		const value = ! ModSettings.get(key);
		this.#coordsGridToogle.set(value);
		this.#saveSetting(key, value);
	}

	#onDescriptiveActionsToogleClicked() {
		const key = ModSettings.KEYS.descriptiveActions;
		const value = ! ModSettings.get(key);
		this.#descriptiveActionsToogle.set(value);
		this.#saveSetting(key, value);
	}

	/** @param {number} value */
	#onWaitAfterHumanNumberDragEnded(value) {
		this.#saveSetting(ModSettings.KEYS.waitAfterHumanTime, value);
	}
}