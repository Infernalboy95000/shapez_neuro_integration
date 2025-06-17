import { SdkAction } from "./sdkAction";

export class EnumSdkAction extends SdkAction {
	/** @type {Array<any>} */ #options;

	/**
	 * @param {string} actionName
	 * @param {string} actionDescription
	 * @param {Array<any>} options
	 */
	constructor(actionName, actionDescription, options = []) {
		super(actionName, actionDescription);
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
		let schema = {
			type: 'object',
			properties: {
				options: {
					enum: []
				}
			},
			required: ['options'],
		}

		for (let i = 0; i < this.#options.length; i++) {
			schema.properties.options.enum.push(this.#options[i]);
		}

		return schema;
	}
}