import { SOUNDS	} from "shapez/platform/sound";
import { NeuroListener } from "../neuroListener";
import { InputSetting } from "./inputSetting";
import { ToggleSetting } from "./toggleSetting";

/**
 * Manages every setting
 * @class SdkSettings
 */
export class SdkSettings {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/**@type {ToggleSetting} */ #sdkToogle;
	/**@type {InputSetting} */#sdkURL;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;
	}

	/**@type {ToggleSetting} */ toogleSetting;
	addSdkToogle(toogleSetting) {
		this.#sdkToogle = toogleSetting;
		this.#setSdkToogleEvents();
		this.#setNeuroListenerEvents();

		if (NeuroListener.isConnected()) {
			this.#sdkToogle.set(true);
		}
	}

	/**@type {InputSetting} */ inputSetting;
	addSdkURL(inputSetting) {
		this.#sdkURL = inputSetting;
		this.#setSdkURLEvents()
	}

	#setSdkToogleEvents() {
		this.#sdkToogle.onClicked = () => { this.#onSdkToogleClicked() };
	}

	#setSdkURLEvents() {
		this.#sdkURL.onFocusOut = (e) => { this.#onSdkUrlFocusOut(e) };
	}

	#setNeuroListenerEvents() {
		NeuroListener.connected = () => { this.#onConnected() };
		NeuroListener.disconnected = () => { this.#onDisconnected() };
		NeuroListener.reattempting = () => { this.#onReattempting() };
		NeuroListener.closed = () => { this.#onClosed() };
		NeuroListener.failed = () => { this.#onFailed() };
		NeuroListener.initCrash = () => { this.#onInitCrash() };
	}

	#onSdkToogleClicked() {
		this.#sdkToogleAction();
	}

	#sdkToogleAction() {
		if (NeuroListener.isConnected()) {
			NeuroListener.disconnect();
			this.#sdkToogle.set(false);
			this.#mod.app.sound.playUiSound(SOUNDS.uiClick);
		}
		else if (this.#mod.settings.socketURL) {
			this.#sdkToogle.changeTitle("Connecting...");
			this.#sdkToogle.changeDescription(`Attempting connection at: ${this.#mod.settings.socketURL} ...`);

			NeuroListener.tryConnect(this.#mod.settings.socketURL);
			this.#mod.app.sound.playUiSound(SOUNDS.uiClick);
		}
		else {
			this.#mod.app.sound.playUiSound(SOUNDS.uiError);
		}
	}

	#onSdkUrlFocusOut(value) {
		this.#saveUrlSetting(value);
	}

	#saveUrlSetting(value) {
		this.#mod.settings.socketURL = value;
		this.#mod.saveSettings();
	}

	#onConnected() {
		this.#sdkToogle.set(true);
		this.#sdkToogle.resetTitle();
		this.#sdkToogle.changeDescription(`Connected to: ${NeuroListener.getCurrentURL()}`);
	}

	#onDisconnected() {
		this.#onFailed();
	}

	#onReattempting() {
		this.#sdkToogle.set(false);
		this.#sdkToogle.changeTitle(`Connecting... (${NeuroListener.getRetriesFormatted()})`);
		this.#sdkToogle.changeDescription(`Attempting connection at: ${NeuroListener.getCurrentURL()} ...`);
	}

	#onClosed() {
		this.#onFailed();
	}

	#onFailed() {
		this.#sdkToogle.set(false);
		this.#sdkToogle.resetTitle();
		this.#sdkToogle.resetDescription();
	}

	#onInitCrash() {
		this.#onFailed();
		this.#sdkURL.markAsError();
		this.#mod.app.sound.playUiSound(SOUNDS.uiError);
	}
}