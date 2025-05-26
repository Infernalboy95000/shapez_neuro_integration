import { SettingBase } from "./settingBase";

/**
 * Creates a button setting
 * @class ButtonSetting
 * @extends {SettingBase}
 */
export class ButtonSetting extends SettingBase {
	static Style = Object.freeze({
		DEFAULT: "default",
		GOOD: "good",
		MAYBE: "maybe",
		BAD: "bad",
	});

	/** @type {CallableFunction} */ onClicked;

	/** @type {HTMLButtonElement} */ #button;
	/** @type {string} */ #defaultBtText;
	/** @type {string} */ #defaultStyle;

	/**
	 * @param {HTMLDivElement} parent
	 * @param {string} title
	 * @param {string} description
	 * @param {string} style
	 * @param {string} attribute
	 */
	constructor(
		parent, title, description, btText,
		style = ButtonSetting.Style.DEFAULT, attribute = ""
	) {
		super(parent, title, description);
		this.#defaultBtText = btText;
		this.#defaultStyle = style;
		this.#createButton(btText, style, attribute);
	}

	changeText(btText) {
		this.#button.textContent = btText;
	}

	resetText() {
		this.#button.textContent = this.#defaultBtText;
	}

	/** @param {string} style */
	changeStyle(style) {
		Object.values(ButtonSetting.Style).forEach(styleValue => {
			this.#button.classList.remove(styleValue);
		});
		this.#button.classList.add(style);
	}

	resetStyle() {
		this.changeStyle(this.#defaultStyle);
	}

	/**
	 * @param {string} btText
	 * @param {string} style
	 * @param {string} attribute
	 * */
	#createButton(btText, style, attribute) {
		this.#button = document.createElement("button");
		this.changeText(btText);
		this.#button.classList.add("settings", "button", "styledButton");
		this.changeStyle(style);

		if (attribute != "")
			this.#button.setAttribute("data-setting", attribute);
		this.addToRow(this.#button);
		this.#setButtonEvents();
	}

	#setButtonEvents() {
		this.#button.addEventListener("click", () => this.#onClicked());
		this.#button.addEventListener("mousedown", () => this.#onMouseDown());
		this.#button.addEventListener("mouseup", () => this.#onMouseUp());
	}

	#onClicked() {
		if (this.onClicked)
			this.onClicked();
	}

	#onMouseDown() {
		this.#button.classList.add("pressed");
	}

	#onMouseUp() {
		this.#button.classList.remove("pressed");
	}
}