import { SOUNDS	} from "shapez/platform/sound";
import { ToggleSetting } from "./toggleSetting";

/**
 * Manages settings related to the SDK context
 * @class ContextSettings
 */
export class ContextSettings {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {ToggleSetting} */ #coordsGridToogle;

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

	#setCoordsGridEvents() {
		this.#coordsGridToogle.onClicked = () => {
			this.#onCoordsGridToogleClicked()
		};
	}

	#saveCoordsGridSetting(value) {
		this.#mod.settings.coordsGrid = value;
		this.#mod.saveSettings();
	}

	#onCoordsGridToogleClicked() {
		const value = !this.#mod.settings.coordsGrid;
		this.#coordsGridToogle.set(value);
		this.#saveCoordsGridSetting(value);
		this.#mod.app.sound.playUiSound(SOUNDS.uiClick);
	}
}