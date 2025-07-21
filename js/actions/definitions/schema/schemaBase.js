export class SchemaBase {
	/** @type {string} */ #propertyName;
	/** @type {boolean} */ #required;
	
	/**
	 * @param {string} propertyName
	 * @param {boolean} required
	 * */
	constructor(propertyName, required = true) {
		if (this.constructor === SchemaBase) {
			throw new Error("Can't instantiate abstract class!");
		}

		this.#propertyName = propertyName;
		this.#required = required;
	}

	/** @returns {Object} */
	getSchema() {
		return {};
	}

	/** @returns {string} */
	getName() {
		return this.#propertyName;
	}

	/** @returns {boolean} */
	isRequired() {
		return this.#required;
	}

	/**
	 * @param {object} data
	 * @returns {boolean}
	 */
	check(data) {
		return true;
	}
}