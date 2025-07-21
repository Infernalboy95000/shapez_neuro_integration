import { SchemaBase } from "./schemaBase";

export class NumberSchema extends SchemaBase {
	/** @type {number} */ #multipleOf;
	/** @type {number} */ #min;
	/** @type {number} */ #max;

	/**
	 * @param {string} propertyName
	 * @param {number} multipleOf
	 * @param {number} min
	 * @param {number} max
	 * @param {boolean} required
	*/
	constructor(
		propertyName, multipleOf = null,
		min = null, max = null, required = true
	) {
		super(propertyName, required);
		this.#multipleOf = multipleOf;
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

		if (this.#multipleOf != null) {
			Object.assign(
				schema[this.getName()], {'multipleOf': this.#multipleOf}
			);
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
	 * @returns {boolean}
	 */
	check(data) {
		if (!data.params[this.getName()]) {
			console.error(`Missing parameter ${this.getName()}`);
			return false;
		}
		
		const value = data.params[this.getName()];
		if (typeof(value) != "number") {
			console.error(`Property ${this.getName()} is not a number`);
			return false;
		}

		if (this.#multipleOf != null) {
			if (value % this.#multipleOf != 0) {
				console.error(`Property ${this.getName()} is not multiple of ${this.#multipleOf}`);
				return false;
			}
		}

		if (this.#min != null) {
			if (value < this.#min) {
				console.error(`Property ${this.getName()} is smaller than the minimum of: ${this.#min}`);
				return false;
			}
		}

		if (this.#max != null) {
			if (value > this.#max) {
				console.error(`Property ${this.getName()} is bigger than the maximum of: ${this.#max}`);
				return false;
			}
		}

		return true;
	}
}