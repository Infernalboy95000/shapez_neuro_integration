import { SOUNDS	} from "shapez/platform/sound";
import { InputSetting } from "./inputSetting";
import { ToggleSetting } from "./toggleSetting";

/**
 * Manages settings related to context
 * @class ConnextionSettings
 */
export class ContextSettings {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/**@type {ToggleSetting} */ #coordsGridToogle;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;
	}

	/** @param {ToggleSetting} toogleSetting */
	addCorodsGridToogle(toogleSetting) {
		this.#coordsGridToogle = toogleSetting;
		this.#setCoordsGridEvents();
		this.#coordsGridToogle.set(this.#mod.settings.coordsGrid);
	}

	#setCoordsGridEvents() {
		this.#coordsGridToogle.onClicked = () => { this.#onCoordsGridToogleClicked() };
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