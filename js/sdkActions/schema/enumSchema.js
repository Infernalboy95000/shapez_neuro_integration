import { SchemaBase } from "./schemaBase";

/** Schema that accepts an option from a set list */
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
	 * @returns {{valid:boolean, msg:string}}
	 */
	check(data) {
		const result = {valid: false, msg:""};
		
		if (!data.params[this.getName()]) {
			result.msg = `Missing parameter ${this.getName()}`;
			return result;
		}
		
		const value = data.params[this.getName()];
		if (typeof(value) != "string") {
			result.msg = `Property ${this.getName()} is not a string`;
			return result;
		}

		for (let i = 0; i < this.#options.length; i++) {
			if (value == this.#options[i]) {
				result.valid = true;
				return result;
			}
		}

		result.msg = `Property ${this.getName()} is not a valid option`;
		return result;
	}
}