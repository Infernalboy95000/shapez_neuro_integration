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
	/**@type {ToggleSetting} */ #coordsGridToogle;

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

	#setSdkClientEvents() {
		SdkClient.connected.add(() => { this.#onConnected() });
		SdkClient.disconnected.add(() => { this.#onDisconnected() });
		SdkClient.reattempting.add(() => { this.#onReattempting() });
		SdkClient.closed.add(() => { this.#onClosed() });
		SdkClient.failed.add(() => { this.#onFailed() });
		SdkClient.initCrash.add(() => { this.#onInitCrash() });
	}

	#onSdkButtonClicked() {
		this.#sdkButtonAction();
	}

	#sdkButtonAction() {
		if (SdkClient.isConnected()) {
			SdkClient.disconnect();
			this.#showConnect();
		}
		else if (SdkClient.isAttempting()) {
			this.#sdkButton.changeDescription("Requested cancellation ...");
			this.#showCancel();
			SdkClient.requestCancell();
		}
		else if (SdkClient.tryConnect(this.#mod.settings.socketURL)) {
			this.#sdkButton.changeTitle("Connecting...");
			this.#sdkButton.changeDescription(`Attempting connection at: ${SdkClient.getCurrentURL()} ...`);
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
		this.#sdkButton.changeDescription(`Connected to: ${SdkClient.getCurrentURL()}`);
	}

	#onDisconnected() {
		this.#onFailed();
	}

	#onReattempting() {
		this.#showCancel();
		this.#sdkButton.changeTitle(`Connecting... (${SdkClient.getRetriesFormatted()})`);
		this.#sdkButton.changeDescription(`Attempting connection at: ${SdkClient.getCurrentURL()} ...`);
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