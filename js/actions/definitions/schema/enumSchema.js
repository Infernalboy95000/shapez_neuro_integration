import { SchemaBase } from "./schemaBase";

export class EnumSchema extends SchemaBase {
	/** @type {Array<any>} */ #options;

	/**
	 * @param {string} propertyName
	 * @param {Array<any>} options
	 * @param {boolean} required
	*/
	constructor(propertyName, options, required = true) {
		super(propertyName, required);
		this.#options = options;
	}

	/** @returns {Object} */
	getSchema() {
		let schema = {
			[this.getName()]: {
				enum: this.#options
			}
		}

		return schema;
	}
}