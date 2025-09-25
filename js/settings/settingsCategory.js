/**
 * This just createsn empty category
 * @class SettingCategory
 */
export class SettingCategory {
	/** @type {HTMLDivElement} */ #baseSetting;
	/** @type {HTMLDivElement} */ #baseRow;
	/** @type {HTMLLabelElement} */ #label;

	constructor(parent, title, isFirst = false) {
		this.#createBaseSetting(parent, isFirst);
		this.#createTitle(title);
	}

	/** @param {HTMLDivElement} parent */
	#createBaseSetting(parent, isFirst) {
		this.#baseSetting = document.createElement("div")
		this.#baseSetting.classList.add(
			"setting", "title", "cardbox", "enabled"
		);

		if (isFirst) {
			this.#baseSetting.classList.add("first");
		}
		parent.appendChild(this.#baseSetting);

		this.#baseRow =	document.createElement("div")
		this.#baseRow.classList.add("row");
		this.#baseSetting.appendChild(this.#baseRow);
	}

	/** @param {string} title */
	#createTitle(title) {
		this.#label	= document.createElement("label");
		this.#baseRow.appendChild(this.#label);
		this.#changeTitle(title);
	}

	/** @param {string} title */
	#changeTitle(title) {
		this.#label.textContent = title;
	}
}