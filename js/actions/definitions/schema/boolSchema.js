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
}