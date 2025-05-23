import { SettingBase } from "./settingBase";

/**
 * Creates a user input setting
 * @class InputSetting
 * @extends {SettingBase}
 */
export class InputSetting extends SettingBase {
	/**@type {CallableFunction} */ onFocusOut;
	
	/**@type {HTMLDivElement} */ #inputParent;
	/**@type {HTMLInputElement} */ #inputElement;

	/**
	 * @param {HTMLDivElement} parent
	 * @param {string} title
	 * @param {string} description
	 * @param {string} attribute
	 * @param {string} type
	 * @param {string} text
	 * @param {number} maxLength
	 */
	constructor(parent, title, description, attribute = "",
		type = "text", text = "", maxLength = 128) {
		super(parent, title, description);
		this.#createInputParent(attribute);
		this.#createInputElement(type, text, maxLength);
	}

	markAsError() {
		this.#showAsErrored();
	}

	/** @param {string} attribute */
	#createInputParent(attribute) {
		this.#inputParent = document.createElement("div");
		this.#inputParent.classList.add("formElement", "input");
		if (attribute != "")
			this.#inputParent.setAttribute("data-setting", attribute);
		this.addToRow(this.#inputParent);
	}

	/**
	 * @param {string} type
	 * @param {string} text
	 * @param {number} maxLength
	 */
	#createInputElement(type, text, maxLength) {
		this.#inputElement = document.createElement("input");
		this.#inputElement.type = type;
		this.#inputElement.value = text;
		this.#inputElement.maxLength = maxLength;
		this.#inputElement.autocomplete = "off";
		this.#inputElement.autocapitalize = "off";
		this.#inputElement.spellcheck = false;
		this.#inputElement.classList.add("input-text");
		this.#inputParent.appendChild(this.#inputElement);
		this.#checkInputErrors();
		this.#setInputEvents();
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
		if (this.onFocusOut)
			this.onFocusOut(this.#inputElement.value);
	}
}