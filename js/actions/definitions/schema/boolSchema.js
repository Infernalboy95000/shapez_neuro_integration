import { SchemaBase } from "./schemaBase";

export class BoolSchema extends SchemaBase {
	/**
	 * @param {string} propertyName
	 * @param {boolean} required
	*/
	constructor(propertyName, required = true) {
		super(propertyName, required);
	}

	/** @returns {Object} */
	getSchema() {
		let schema = {
			[this.getName()]: {
				type: "boolean"
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
		if (typeof(value) != "boolean") {
			console.error(`Property ${this.getName()} is not a boolean (true or false)`);
			return false;
		}

		console.error(`Property ${this.getName()} is not a valid option`);
		return true;
	}
}