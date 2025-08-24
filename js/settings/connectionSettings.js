import { SOUNDS	} from "shapez/platform/sound";
import { SdkClient } from "../sdkClient";
import { TextSetting } from "./inputs/textSetting";
import { ToggleSetting } from "./inputs/toggleSetting";
import { ButtonSetting } from "./inputs/buttonSetting";

/**
 * Manages settings related to connextion
 * @class ConnectionSettings
 */
export class ConnectionSettings {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/**@type {ButtonSetting} */ #sdkButton;
	/**@type {TextSetting} */#sdkURL;
	/**@type {ToggleSetting} */ #hideURL;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 */
	constructor(mod) {
		this.#mod = mod;
	}

	/** @param {ButtonSetting} buttonSetting */
	addSdkButton(buttonSetting) {
		this.#sdkButton = buttonSetting;
		this.#setSdkButtonEvents();
		this.#setSdkClientEvents();

		if (SdkClient.isConnected()) {
			this.#showDisconnect();
		}
		else if (SdkClient.isAttempting()) {
			this.#onReattempting();
			this.#showCancel();
		}
	}

	/** @param {TextSetting} textSetting */
	addSdkURL(textSetting) {
		this.#sdkURL = textSetting;
		this.#setSdkURLEvents();
		this.#updateSdkURLinputType();
	}

	/** @param {ToggleSetting} toogleSetting */
	addHideURL(toogleSetting) {
		this.#hideURL = toogleSetting;
		this.#setHideURLEvents();
		this.#hideURL.set(this.#mod.settings.hideURL);
	}

	#setSdkButtonEvents() {
		this.#sdkButton.onClicked = () => { this.#onSdkButtonClicked() };
	}

	#setSdkURLEvents() {
		this.#sdkURL.onFocusOut = (e) => { this.#onSdkUrlFocusOut(e) };
	}

	#setHideURLEvents() {
		this.#hideURL.onClicked = () => { this.#onHideURLToogled() };
	}

	#setSdkClientEvents() {
		SdkClient.connected.add("settingsCon", () => { this.#onConnected() });
		SdkClient.disconnected.add("settingsDis", () => { this.#onDisconnected() });
		SdkClient.reattempting.add("settingsReat", () => { this.#onReattempting() });
		SdkClient.closed.add("settingsClo", () => { this.#onClosed() });
		SdkClient.failed.add("settingsFail", () => { this.#onFailed() });
		SdkClient.initCrash.add("settingsKo", () => { this.#onInitCrash() });
	}

	#onSdkButtonClicked() {
		this.#sdkButtonAction();
	}

	#onSdkUrlFocusOut(value) {
		this.#saveUrlSetting(value);
	}

	#onHideURLToogled() {
		const value = !this.#mod.settings.hideURL;
		this.#hideURL.set(value);
		this.#saveHideURLSetting(value);
		this.#updateConnectionDescription();
		this.#updateSdkURLinputType();
	}

	#sdkButtonAction() {
		if (SdkClient.isConnected()) {
			SdkClient.disconnect();
			this.#showConnect();
		}
		else if (SdkClient.isAttempting()) {
			this.#sdkButton.changeDescription("Requested cancellation...");
			this.#showCancel();
			SdkClient.requestCancell();
		}
		else if (SdkClient.tryConnect(this.#mod.settings.socketURL)) {
			this.#sdkButton.changeTitle("Connecting...");
			this.#updateConnectionDescription();
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

	#updateSdkURLinputType() {
		if (this.#mod.settings.hideURL) {
			this.#sdkURL.changeType("password");
		}
		else {
			this.#sdkURL.changeType("text");
		}
	}

	#updateConnectionDescription() {
		if (SdkClient.isConnected()) {
			if (this.#mod.settings.hideURL) {
				this.#sdkButton.changeDescription(`Connected.`);
			} else {
				this.#sdkButton.changeDescription(`Connected to: ${SdkClient.getCurrentURL()}`);
			}
		}
		else if (SdkClient.isAttempting()) {
			if (this.#mod.settings.hideURL) {
				this.#sdkButton.changeDescription(`Attempting connection...`);
			}
			else {
				this.#sdkButton.changeDescription(`Attempting connection at: ${SdkClient.getCurrentURL()}...`);
			}
		}
		else {
			this.#sdkButton.resetDescription();
		}
	}

	#saveUrlSetting(value) {
		this.#mod.settings.socketURL = value;
		this.#mod.saveSettings();
	}

	#saveHideURLSetting(value) {
		this.#mod.settings.hideURL = value;
		this.#mod.saveSettings();
	}

	#onConnected() {
		this.#showDisconnect();
		this.#sdkButton.resetTitle();
		this.#updateConnectionDescription();
	}

	#onDisconnected() {
		this.#onFailed();
	}

	#onReattempting() {
		this.#showCancel();
		const reattempts = SdkClient.getRetriesFormatted();
		if (reattempts.includes("0")) {
			this.#sdkButton.changeTitle(`Connecting...`);
		}
		else {
			this.#sdkButton.changeTitle(`Connecting... (${reattempts})`);
		}
		this.#updateConnectionDescription();
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
}