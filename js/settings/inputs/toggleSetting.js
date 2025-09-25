import { SOUNDS } from "shapez/platform/sound";
import { SettingBase } from "./settingBase";

/**
 * Creates a toogle setting
 * @class ToggleSetting
 * @extends {SettingBase}
 */
export class ToggleSetting extends SettingBase {
	/** @type {CallableFunction} */ onClicked;

	/** @type {HTMLDivElement} */ #toggle;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {HTMLDivElement} parent
	 * @param {string} title
	 * @param {string} description
	 * @param {string} attribute
	 */
	constructor(mod, parent, title, description, attribute = "") {
		super(mod, parent, title, description);
		this.#createToogle(attribute);
	}

	/** @param {boolean} checked */
	set(checked) {
		if (checked) {
			if (!this.#toggle.classList.contains("checked")) {
				this.#toggle.classList.add("checked");
			}
		}
		else {
			if (this.#toggle.classList.contains("checked")) {
				this.#toggle.classList.remove("checked");
			}
		}
	}

	/** @param {string} attribute */
	#createToogle(attribute) {
		this.#toggle = document.createElement("div");
		this.#toggle.classList.add("value", "checkbox");
		if (attribute != "")
			this.#toggle.setAttribute("data-setting", attribute);
		this.addToRow(this.#toggle);
		this.#setToogleEvents();

		const knob = document.createElement("span");
		knob.classList.add("knob");
		this.#toggle.appendChild(knob);
	}

	#setToogleEvents() {
		this.#toggle.addEventListener("click", () => this.#onClicked());
		this.#toggle.addEventListener("mousedown", () => this.#onMouseDown());
		this.#toggle.addEventListener("mouseup", () => this.#onMouseUp());
		this.#toggle.addEventListener("mouseleave", () => this.#onMouseLeave());
	}

	#onClicked() {
		if (this.onClicked)
			this.onClicked();
	}

	#onMouseDown() {
		this.#toggle.classList.add("pressed");
		this.playSound(SOUNDS.uiClick);
	}

	#onMouseUp() {
		this.#toggle.classList.remove("pressed");
	}

	#onMouseLeave() {
		this.#toggle.classList.remove("pressed");
	}
}