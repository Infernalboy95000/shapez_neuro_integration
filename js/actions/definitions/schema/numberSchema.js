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
}