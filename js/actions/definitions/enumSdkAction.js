import { SdkAction } from "./sdkAction";

export class EnumSdkAction extends SdkAction {
	/** @type {Array<any>} */ #options;
	/** @type {string} */ #optionsName = "";

	/**
	 * @param {string} actionName
	 * @param {string} actionDescription
	 * @param {string} optionsName
	 * @param {Array<any>} options
	 */
	constructor(actionName, actionDescription, optionsName = "options", options = []) {
		super(actionName, actionDescription);
		this.#optionsName = optionsName;
		this.#options = options;
	}

	/** @returns {Object} */
	build() {
		return super.build(this.#getSchema());
	}

	/** @param {Array<any>} options */
	setOptions(options) {
		this.#options = new Array();
		for (let i = 0; i < options.length; i++) {
			this.#options.push(options[i]);
		}
	}

	/** @returns {Object} */
	#getSchema() {
		let schemaString = '{' +
			'"type":"object",' +
			'"properties":{"' +
				this.#optionsName + '":{' +
					'"enum":[]' +
				'}' +
			'},' +
			'"required":["' + this.#optionsName + '"]}';
		let schema = JSON.parse(schemaString);

		for (let i = 0; i < this.#options.length; i++) {
			schema.properties[this.#optionsName].enum.push(this.#options[i]);
		}

		return schema;
	}
}