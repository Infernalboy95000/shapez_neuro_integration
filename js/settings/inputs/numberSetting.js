import { SOUNDS } from "shapez/platform/sound";
import { SettingBase } from "./settingBase";

export class NumberSetting extends SettingBase {
	/** @type {CallableFunction} */ onDragEnded;

	/** @type {HTMLDivElement} */ #rangeBase;
	/** @type {HTMLInputElement} */ #slider;
	/** @type {HTMLLabelElement} */ #value;
	/** @type {string} */ #symbol;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {HTMLDivElement} parent
	 * @param {string} title
	 * @param {string} description
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 * @param {number} step
	 * @param {string} symbol
	 * @param {string} attribute
	 */
	constructor(
		mod, parent, title, description, value, min, max, step,
		symbol = "", attribute = ""
	) {
		super(mod, parent, title, description);
		this.#symbol = symbol;
		this.createElement(value, min, max, step, attribute);
	}

	/**
	 * @param {number} value
	 * @param {number} min
	 * @param {number} max
	 * @param {number} step
	 * @param {string} attribute
	 * */
	createElement(value, min, max, step, attribute) {
		this.#rangeBase = document.createElement("div");
		this.#rangeBase.classList.add("value", "rangeInputContainer", "noPressEffect");
		if (attribute != "")
			this.#rangeBase.setAttribute("data-setting", attribute);
		this.addToRow(this.#rangeBase);

		this.#value = document.createElement("label");
		this.#slider = document.createElement("input");
		this.#slider.classList.add("rangeInput");
		this.#slider.type = "range";
		this.#slider.min = min.toString();
		this.#slider.max = max.toString();
		this.#slider.step = step.toString();
		this.#slider.value = value.toString();
		this.#setSliderEvents();

		this.#rangeBase.appendChild(this.#value);
		this.#rangeBase.appendChild(this.#slider);
		this.#onDrag();
	}

	#setSliderEvents() {
		this.#slider.addEventListener("mousedown", () => this.#onMouseDown());
		this.#slider.addEventListener("mouseup", () => this.#onMouseUp());
		this.#slider.addEventListener("input", () => this.#onDrag());
	}

	#onMouseDown() {
		this.#rangeBase.classList.add("pressed");
		this.playSound(SOUNDS.uiClick);
	}

	#onMouseUp() {
		this.#rangeBase.classList.remove("pressed");
		if (this.onDragEnded) {
			this.onDragEnded(this.#slider.valueAsNumber);
		}
	}

	#onDrag() {
		const value = this.#slider.value;
		this.#value.textContent = `${value} ${this.#symbol}`;
	}
}