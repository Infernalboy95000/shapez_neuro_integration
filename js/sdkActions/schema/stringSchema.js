import { SchemaBase } from "./schemaBase";

/** Schema that accepts a string*/
export class StringSchema extends SchemaBase {
	/** @type {number} */ #min;
	/** @type {number} */ #max;

	/**
	 * @param {string} propertyName
	 * @param {boolean} required
	*/
	constructor(propertyName, min = null, max = null, required = true) {
		super(propertyName, required);
		if (this.#min && this.#max && this.#min > this.#max)
			this.#min = this.#max;

		this.#min = min;
		this.#max = max;
	}

	/** @returns {Object} */
	getSchema() {
		let schema = {
			[this.getName()]: {
				type: "string"
			}
		}

		if (this.#min != null && this.#min > 0) {
			Object.assign(
				schema[this.getName()], {'minLength': this.#min}
			);
		}

		if (this.#max != null && this.#max > 0) {
			Object.assign(
				schema[this.getName()], {'maxLength': this.#max}
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

		if (!data.params[this.getName()]) {
			result.msg = `Missing parameter "${this.getName()}"`;
			return result;
		}

		const value = data.params[this.getName()];
		if (typeof(value) != "string") {
			result.msg = `Value set in parameter "${this.getName()}" is not a string`;
			return result;
		}

		if (this.#min != null) {
			if (value.length < this.#min) {
				result.msg = `Value set in parameter "${this.getName()}" has less characters than the minimum of: ${this.#min}`;
				return result;
			}
		}

		if (this.#max != null) {
			if (value.length > this.#max) {
				result.msg = `Value set in parameter "${this.getName()}" has more characters than the maximum of: ${this.#max}`;
				return result;
			}
		}

		result.valid = true;
		return result;
	}
}