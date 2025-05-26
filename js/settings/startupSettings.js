import { SOUNDS	} from "shapez/platform/sound";
import { ToggleSetting } from "./toggleSetting";

/**
 * Manages settings related to startup actions
 * @class ConnextionSettings
 */
export class StartupSettings {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ToggleSetting} */ #autoConnectToggle;
	/** @type {ToggleSetting} */ #playerChooseMapToggle;
	/** @type {ToggleSetting} */ #forceOpenMapToggle;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;
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

	#onAutoConnectToogleClicked() {
		const value = !this.#mod.settings.autoConnect;
		this.#autoConnectToggle.set(value);
		this.#saveAutoConnectSetting(value);
		this.#mod.app.sound.playUiSound(SOUNDS.uiClick);
	}

	#onPlayerChooseMapToogleClicked() {
		const value = !this.#mod.settings.playerChooseMap;
		this.#playerChooseMapToggle.set(value);
		this.#savePlayerChooseMapSetting(value);
		this.#mod.app.sound.playUiSound(SOUNDS.uiClick);
	}

	#onForceOpenMapToogleClicked() {
		const value = !this.#mod.settings.forceOpenMap;
		this.#forceOpenMapToggle.set(value);
		this.#saveForceOpenMapSetting(value);
		this.#mod.app.sound.playUiSound(SOUNDS.uiClick);
	}
}