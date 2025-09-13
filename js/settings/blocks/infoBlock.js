/**
 * Abstract class for a setting
 * @class SettingBase
 */
export class InfoBlock {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {HTMLDivElement} */ #baseSetting;
	/** @type {HTMLDivElement} */ #baseRow;
	/** @type {HTMLLabelElement} */ #label;
	/** @type {HTMLDivElement} */ #divDescription;

	constructor(parent, title, description) {
		this.#createBaseSetting(parent);
		this.#createTitle(title);
		this.#createDescription(description);
	}

	/** @param {HTMLElement} parent */
	#createBaseSetting(parent) {
		this.#baseSetting = document.createElement("div")
		this.#baseSetting.classList.add("setting", "cardbox", "enabled");
		parent.appendChild(this.#baseSetting);

		this.#baseRow =	document.createElement("div")
		this.#baseRow.classList.add("row");
		this.#baseSetting.appendChild(this.#baseRow);
	}

	/** @param {string} title */
	#createTitle(title) {
		this.#label	= document.createElement("label");
		this.#baseRow.appendChild(this.#label);
		this.#label.textContent = title;
	}

	/** @param {string} description */
	#createDescription(description) {
		this.#divDescription = document.createElement("div")
		this.#divDescription.classList.add("desc");
		this.#baseSetting.appendChild(this.#divDescription);
		this.#divDescription.innerHTML = description;
	}
}