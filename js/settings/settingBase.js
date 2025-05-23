/**
 * Abstract class for a setting
 * @class SettingBase
 */
export class SettingBase {
	/** @type {string} */ #defaultTitle;
	/** @type {string} */ #defaultDescription;
	/** @type {HTMLDivElement} */ #baseSetting;
	/** @type {HTMLDivElement} */ #baseRow;
	/** @type {HTMLLabelElement} */ #label;
	/** @type {HTMLDivElement} */ #divDescription;

	constructor(parent, title, description) {
		if (this.constructor === SettingBase) {
			throw new Error("Can't instantiate abstract class!");
		}

		this.#defaultTitle = title;
		this.#defaultDescription = description;
		this.#createBaseSetting(parent);
		this.#createTitle(title);
		this.#createDescription(description);
	}

	/** @param {string} title */
	changeTitle(title) {
		this.#label.textContent = title;
	}

	resetTitle() {
		this.#label.textContent = this.#defaultTitle;
	}

	/** @param {string} description */
	changeDescription(description) {
		this.#divDescription.textContent = description;
	}

	resetDescription() {
		this.#divDescription.textContent = this.#defaultDescription;
	}

	/** @param {HTMLDivElement} element */
	addToRow(element) {
		this.#baseRow.appendChild(element);
	}

	/** @param {HTMLDivElement} parent */
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
		this.changeTitle(title);
	}

	/** @param {string} description */
	#createDescription(description) {
		this.#divDescription = document.createElement("div")
		this.#divDescription.classList.add("desc");
		this.#baseSetting.appendChild(this.#divDescription);
		this.changeDescription(description);
	}
}