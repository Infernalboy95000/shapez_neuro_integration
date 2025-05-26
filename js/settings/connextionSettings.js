import { SOUNDS	} from "shapez/platform/sound";
import { NeuroListener } from "../neuroListener";
import { InputSetting } from "./inputSetting";
import { ToggleSetting } from "./toggleSetting";

/**
 * Manages settings related to connextion
 * @class ConnextionSettings
 */
export class ConnextionSettings {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/**@type {ToggleSetting} */ #sdkToogle;
	/**@type {InputSetting} */#sdkURL;
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
	addSdkToogle(toogleSetting) {
		this.#sdkToogle = toogleSetting;
		this.#setSdkToogleEvents();
		this.#setNeuroListenerEvents();

		if (NeuroListener.isConnected()) {
			this.#sdkToogle.set(true);
		}
	}

	/** @param {InputSetting} inputSetting */
	addSdkURL(inputSetting) {
		this.#sdkURL = inputSetting;
		this.#setSdkURLEvents()
	}

	/** @param {ToggleSetting} toogleSetting */
	addCorodsGridToogle(toogleSetting) {
		this.#coordsGridToogle = toogleSetting;
		this.#setCoordsGridEvents();
		this.#coordsGridToogle.set(this.#mod.settings.coordsGrid);
	}

	#setSdkToogleEvents() {
		this.#sdkToogle.onClicked = () => { this.#onSdkToogleClicked() };
	}

	#setSdkURLEvents() {
		this.#sdkURL.onFocusOut = (e) => { this.#onSdkUrlFocusOut(e) };
	}

	#setCoordsGridEvents() {
		this.#coordsGridToogle.onClicked = () => { this.#onCoordsGridToogleClicked() };
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
		else if (NeuroListener.isAttempting()) {
			this.#sdkToogle.changeDescription("Requested cancellation ...");
			NeuroListener.requestCancell();
			this.#mod.app.sound.playUiSound(SOUNDS.uiClick);
		}
		else if (NeuroListener.tryConnect(this.#mod.settings.socketURL)) {
			this.#sdkToogle.changeTitle("Connecting...");
			this.#sdkToogle.changeDescription(`Attempting connection at: ${NeuroListener.getCurrentURL()} ...`);
			this.#mod.app.sound.playUiSound(SOUNDS.uiClick);
		}
	}

	#onSdkUrlFocusOut(value) {
		this.#saveUrlSetting(value);
	}

	#saveUrlSetting(value) {
		this.#mod.settings.socketURL = value;
		this.#mod.saveSettings();
	}

	#saveCoordsGridSetting(value) {
		this.#mod.settings.coordsGrid = value;
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

	#onCoordsGridToogleClicked() {
		const value = !this.#mod.settings.coordsGrid;
		this.#coordsGridToogle.set(value);
		this.#saveCoordsGridSetting(value);
	}
}