import { SchemaBase } from "./schema/schemaBase";

/** Defines a player action. Can have none or multiple options. */
export class SdkAction {
	/** @type {string} */ #actName;
	/** @type {string} */ #actDesc;
	/** @type {Array<SchemaBase>} */ #options = [];

	/**
	 * @param {string} actionName
	 * @param {string} actionDescription
	 */
	constructor(actionName, actionDescription) {
		this.#actName = actionName;
		this.#actDesc = actionDescription;
	}

	/** @returns {Object} */
	build() {
		const action = {
			name: this.#actName,
			description: this.#actDesc,
			schema: this.#getSchema(),
		}

		return action;
	}

	/** @param {Array<SchemaBase>} options */
	setOptions(options) {
		this.#options = options;
	}

	/** @returns {string} */
	getName() {
		return this.#actName;
	}

	/** @param {string} actDesc */
	setDescription(actDesc) {
		this.#actDesc = actDesc;
	}

	/**
	 * @param {Object} data
	 * @returns {{valid:boolean, msg:string}}
	 * */
	checkResponse(data) {
		const action = {valid: true, msg:""};
		for (let i = 0; i < this.#options.length; i++) {
			const value = this.#options[i].check(data);
			if (!value.valid) {
				action.msg += value.msg;
				if (i + 1 < this.#options.length) {
					action.msg += "\r\n";
				}
			}
		}
		return action;
	}

	/** @returns {Object} */
	#getSchema() {
		if (this.#options.length > 0) {
			const schema = {
				type: 'object',
				properties: this.#getOptionsSchema(),
				required: this.#getRequirementsSchema()
			};
			return schema;
		}
		return {};
	}

	/** @returns {Object} */
	#getOptionsSchema() {
		const schemas = {};

		for (let i = 0; i < this.#options.length; i++) {
			Object.assign(schemas, this.#options[i].getSchema());
		}

		return schemas;
	}

	/** @returns {Object} */
	#getRequirementsSchema() {
		const requirements = [];

		for (let i = 0; i < this.#options.length; i++) {
			if (this.#options[i].isRequired()) {
				requirements.push(this.#options[i].getName());
			}
		}

		if (requirements.length <= 0) {
			requirements.push(this.#options[0].getName());
		}

		return requirements;
	}
}