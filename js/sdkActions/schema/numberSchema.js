import { SchemaBase } from "./schemaBase";

/** Schema that accepts a number, with certain filters */
export class NumberSchema extends SchemaBase {
	/** @type {number} */ #min;
	/** @type {number} */ #max;

	/**
	 * @param {string} propertyName
	 * @param {number} min
	 * @param {number} max
	 * @param {boolean} required
	*/
	constructor(
		propertyName,
		min = null, max = null, required = true
	) {
		super(propertyName, required);
		this.#min = min;
		this.#max = max;
	}

	/** @returns {Object} */
	getSchema() {
		let schema = {
			[this.getName()]: {
				type: 'number'
			}
		}

		if (this.#min != null) {
			Object.assign(
				schema[this.getName()], {'minimum': this.#min}
			);
		}

		if (this.#max != null) {
			Object.assign(
				schema[this.getName()], {'maximum': this.#max}
			);
		}

		return schema;
	}

	/**
	 * @param {object} data
	 * @returns {{valid:boolean, msg:string}}
	 */
	check(data) {
		const result = {valid: false, msg:""};

		if (data.params[this.getName()] == undefined) {
			result.msg = `Missing parameter "${this.getName()}"`;
			return result;
		}
		
		const value = data.params[this.getName()];
		if (typeof(value) != "number") {
			result.msg = `Value set in parameter "${this.getName()}" is not a number`;
			return result;
		}

		if (this.#min != null) {
			if (value < this.#min) {
				result.msg = `Value set in parameter "${this.getName()}" is smaller than the minimum of: ${this.#min}`;
				return result;
			}
		}

		if (this.#max != null) {
			if (value > this.#max) {
				result.msg = `Value set in parameter "${this.getName()}" is bigger than the maximum of: ${this.#max}`;
				return result;
			}
		}

		data.params[this.getName()] = Math.round(value);

		result.valid = true;
		return result;
	}
}