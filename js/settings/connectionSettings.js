import { SOUNDS	} from "shapez/platform/sound";
import { NeuroListener } from "../neuroListener";
import { TextSetting } from "./inputs/textSetting";
import { ToggleSetting } from "./inputs/toggleSetting";
import { ButtonSetting } from "./inputs/buttonSetting";

/**
 * Manages settings related to connextion
 * @class ConnectionSettings
 */
export class ConnectionSettings {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/**@type {ButtonSetting} */ #sdkButton;
	/**@type {TextSetting} */#sdkURL;
	/**@type {ToggleSetting} */ #coordsGridToogle;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;
	}

	/** @param {ButtonSetting} buttonSetting */
	addSdkButton(buttonSetting) {
		this.#sdkButton = buttonSetting;
		this.#setSdkButtonEvents();
		this.#setNeuroListenerEvents();

		if (NeuroListener.isConnected()) {
			this.#showDisconnect();
		}
	}

	/** @param {TextSetting} textSetting */
	addSdkURL(textSetting) {
		this.#sdkURL = textSetting;
		this.#setSdkURLEvents()
	}

	/** @param {ToggleSetting} toogleSetting */
	addCorodsGridToogle(toogleSetting) {
		this.#coordsGridToogle = toogleSetting;
		this.#setCoordsGridEvents();
		this.#coordsGridToogle.set(this.#mod.settings.coordsGrid);
	}

	#setSdkButtonEvents() {
		this.#sdkButton.onClicked = () => { this.#onSdkButtonClicked() };
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

	#onSdkButtonClicked() {
		this.#sdkButtonAction();
	}

	#sdkButtonAction() {
		if (NeuroListener.isConnected()) {
			NeuroListener.disconnect();
			this.#showConnect();
		}
		else if (NeuroListener.isAttempting()) {
			this.#sdkButton.changeDescription("Requested cancellation ...");
			this.#showCancel();
			NeuroListener.requestCancell();
		}
		else if (NeuroListener.tryConnect(this.#mod.settings.socketURL)) {
			this.#sdkButton.changeTitle("Connecting...");
			this.#sdkButton.changeDescription(`Attempting connection at: ${NeuroListener.getCurrentURL()} ...`);
			this.#showCancel();
		}
	}

	#showConnect() {
		this.#sdkButton.resetText();
		this.#sdkButton.resetStyle();
	}

	#showCancel() {
		this.#sdkButton.changeText("Cancel");
		this.#sdkButton.changeStyle(ButtonSetting.Style.MAYBE);
	}

	#showDisconnect() {
		this.#sdkButton.changeText("Disconnect");
		this.#sdkButton.changeStyle(ButtonSetting.Style.BAD);
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
		this.#showDisconnect();
		this.#sdkButton.resetTitle();
		this.#sdkButton.changeDescription(`Connected to: ${NeuroListener.getCurrentURL()}`);
		NeuroListener.sendMessage(
			"A human player is on the settings menu. Please, wait patiently till they finish."
		)
	}

	#onDisconnected() {
		this.#onFailed();
	}

	#onReattempting() {
		this.#showCancel();
		this.#sdkButton.changeTitle(`Connecting... (${NeuroListener.getRetriesFormatted()})`);
		this.#sdkButton.changeDescription(`Attempting connection at: ${NeuroListener.getCurrentURL()} ...`);
	}

	#onClosed() {
		this.#onFailed();
	}

	#onFailed() {
		this.#showConnect();
		this.#sdkButton.resetTitle();
		this.#sdkButton.resetDescription();
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