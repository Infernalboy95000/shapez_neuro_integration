import { SOUNDS } from "shapez/platform/sound";
import { ModSettings } from "../modSettings";
import { SdkClient } from "../sdkClient";
import { ButtonSetting } from "./inputs/buttonSetting";
import { StatusDisplay } from "../visuals/statusDisplay";

export class MainMenuConnector {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {StatusDisplay} */ #status;
	/** @type {HTMLInputElement} */ #inputElement;
	/** @type {HTMLButtonElement} */ #button;

	/** @param {import("shapez/mods/mod").Mod} mod */
	constructor(mod) {
		this.#mod = mod;
		this.#connectEvents();
	}

	/**
	 * @param {StatusDisplay} statusDisplay;
	 * @param {Element} parent
	 * */
	show(statusDisplay, parent) {
		this.#status = statusDisplay;
		if (this.#button) {
			this.#button.remove();
		}
		this.#create(parent.querySelector(""));
	}

	/** @param {Element} parent */
	#create(parent) {
		const divParent = document.createElement("div");
		divParent.id = "sdkInputParent";
		divParent.textContent = "URL:";
		parent.appendChild(divParent);

		const divContainer = document.createElement("div");
		divContainer.id = "sdkInputContainer";
		divParent.appendChild(divContainer);

		this.#createInputElement(divContainer, ModSettings.get(ModSettings.KEYS.socketURL), 256);
		this.#button = document.createElement("button");
		this.#button.classList.add("settings", "button", "styledButton");
		divContainer.appendChild(this.#button);
		this.#updateSdkURLinputType();
		this.#setButtonEvents();
		this.#refreshStatus();
	}

	/**
	 * @param {Element} parent
	 * @param {string} text
	 * @param {number} maxLength
	 */
	#createInputElement(parent, text, maxLength) {
		this.#inputElement = document.createElement("input");
		this.#inputElement.value = text;
		this.#inputElement.maxLength = maxLength;
		this.#inputElement.autocomplete = "off";
		this.#inputElement.autocapitalize = "off";
		this.#inputElement.spellcheck = false;
		this.#inputElement.classList.add("input-text");
		parent.appendChild(this.#inputElement);
		this.#checkInputErrors();
		this.#setInputEvents();
	}

	#changeBtText(btText) {
		this.#button.textContent = btText;
	}

	/** @param {string} style */
	#changeBtStyle(style) {
		Object.values(ButtonSetting.Style).forEach(styleValue => {
			this.#button.classList.remove(styleValue);
		});
		this.#button.classList.add(style);
	}

	/** @param {string} status @param {string} style */
	#showBtStatus(status, style) {
		this.#changeBtText(status);
		this.#changeBtStyle(style);
	}

	#updateSdkURLinputType() {
		if (ModSettings.get(ModSettings.KEYS.hideURL)) {
			this.#inputElement.type = "password";
		}
		else {
			this.#inputElement.type = "text";
		}
	}

	#setButtonEvents() {
		this.#button.addEventListener("click", () => this.#onSdkButtonClicked());
		this.#button.addEventListener("mousedown", () => this.#onMouseDown());
		this.#button.addEventListener("mouseup", () => this.#onMouseUp());
		this.#button.addEventListener("mouseleave", () => this.#onMouseLeave());
	}

	#connectEvents() {
		SdkClient.connected.add("mainMenuCon", () => { this.#showDisconnect() });
		SdkClient.disconnected.add("mainMenuDis",() => { this.#showConnect() });
		SdkClient.closed.add("mainMenuClo",() => { this.#showConnect() });
		SdkClient.failed.add("mainMenuFail",() => { this.#showConnect() });
		SdkClient.initCrash.add("mainMenuKo",() => { this.#showConnect() });
	}

	#refreshStatus() {
		this.#updateSdkURLinputType();
		if (SdkClient.isConnected()) {
			this.#showDisconnect();
		}
		else if (!SdkClient.isAttempting()) {
			this.#showConnect();
		}
	}

	#showDisconnect() {
		this.#showBtStatus("Disconnect", ButtonSetting.Style.BAD);
	}

	#showConnect() {
		this.#showBtStatus("Connect", ButtonSetting.Style.DEFAULT);
	}

	#showCancel() {
		this.#showBtStatus("Cancel", ButtonSetting.Style.MAYBE);
	}

	#onSdkButtonClicked() {
		if (SdkClient.isConnected()) {
			SdkClient.disconnect();
			this.#showConnect();
		}
		else if (SdkClient.isAttempting()) {
			this.#status.setText("Requested cancellation...", "attempting");
			this.#showCancel();
			SdkClient.requestCancell();
		}
		else if (SdkClient.tryConnect(ModSettings.get(ModSettings.KEYS.socketURL))) {
			this.#status.setText("Connecting...", "attempting");
			this.#showCancel();
		}
	}

	#onMouseDown() {
		this.#button.classList.add("pressed");
		this.#mod.app.sound.playUiSound(SOUNDS.uiClick);
	}

	#onMouseUp() {
		this.#button.classList.remove("pressed");
	}

	#onMouseLeave() {
		this.#button.classList.remove("pressed");
	}

	#setInputEvents() {
		this.#inputElement.addEventListener("input", () => this.#onInput());
		this.#inputElement.addEventListener("focusout", () => this.#onFocusOut());
	}

	#checkInputErrors() {
		if (this.#inputElement.value != "") {
			this.#showAsAllGood();
		}
		else {
			this.#showAsErrored();
		}
	}

	#showAsErrored() {
		if (!this.#inputElement.classList.contains("errored"))
			this.#inputElement.classList.add("errored");
	}

	#showAsAllGood() {
		if (this.#inputElement.classList.contains("errored"))
			this.#inputElement.classList.remove("errored");
	}

	#onInput() {
		this.#checkInputErrors();
	}

	#onFocusOut() {
		ModSettings.set(ModSettings.KEYS.socketURL, this.#inputElement.value);
		ModSettings.save();
	}
}