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

	/**
	 * @param {object} data
	 * @returns {boolean}
	 */
	check(data) {
		if (!data.params[this.getName()]) {
			console.error(`Missing parameter ${this.getName()}`);
			return false;
		}
		
		const value = data.params[this.getName()];
		if (typeof(value) != "string") {
			console.error(`Property ${this.getName()} is not a string`);
			return false;
		}

		for (let i = 0; i < this.#options.length; i++) {
			if (value == this.#options[i]) {
				return true;
			}
		}

		console.error(`Property ${this.getName()} is not a valid option`);
		return false;
	}
}