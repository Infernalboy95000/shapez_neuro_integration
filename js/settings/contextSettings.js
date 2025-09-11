import { NumberSetting } from "./inputs/numberSetting";
import { ToggleSetting } from "./inputs/toggleSetting";

/**
 * Manages settings related to the SDK context
 * @class ContextSettings
 */
export class ContextSettings {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {ToggleSetting} */ #coordsGridToogle;
	/** @type {NumberSetting} */ #waitAfterHumanNumber;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 */
	constructor(mod) {
		this.#mod = mod;
	}

	/** @param {ToggleSetting} toogleSetting */
	addCorodsGridToogle(toogleSetting) {
		this.#coordsGridToogle = toogleSetting;
		this.#setCoordsGridEvents();
		this.#coordsGridToogle.set(this.#mod.settings.coordsGrid);
	}

	/** @param {NumberSetting} numberSetting */
	addWaitAfterHumanNumber(numberSetting) {
		this.#waitAfterHumanNumber = numberSetting;
		this.#setWaitAfterHumanEvents();
	}

	#setCoordsGridEvents() {
		this.#coordsGridToogle.onClicked = () => {
			this.#onCoordsGridToogleClicked();
		};
	}

	#setWaitAfterHumanEvents() {
		this.#waitAfterHumanNumber.onDragEnded = (e) => {
			this.#onWaitAfterHumanNumberDragEnded(e);
		};
	}

	#saveCoordsGridSetting(value) {
		this.#mod.settings.coordsGrid = value;
		this.#mod.saveSettings();
	}

	#saveWaitAfterHumanSetting(value) {
		this.#mod.settings.waitAfterHumanTime = value;
		this.#mod.saveSettings();
	}

	#onCoordsGridToogleClicked() {
		const value = !this.#mod.settings.coordsGrid;
		this.#coordsGridToogle.set(value);
		this.#saveCoordsGridSetting(value);
	}

	/** @param {number} value */
	#onWaitAfterHumanNumberDragEnded(value) {
		this.#saveWaitAfterHumanSetting(value);
	}
}