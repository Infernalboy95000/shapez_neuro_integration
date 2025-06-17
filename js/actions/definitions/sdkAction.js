export class SdkAction {
	/** @type {string} */ #actName;
	/** @type {string} */ #actDesc;

	constructor(actName, actDesc) {
		if (this.constructor === SdkAction) {
			throw new Error("Can't instantiate abstract class!");
		}

		this.#actName = actName;
		this.#actDesc = actDesc;
	}

	/** @param {Object} schema */
	/** @returns{Object} */
	build(schema = {}) {
		const action = {
			name: this.#actName,
			description: this.#actDesc,
			schema: schema,
		}

		return action;
	}

	/** @returns {string} */
	getName() {
		return this.#actName;
	}

	/** @param {string} actDesc */
	setDescription(actDesc) {
		this.#actDesc = actDesc;
	}
}