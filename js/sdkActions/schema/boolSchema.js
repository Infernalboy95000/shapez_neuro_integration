import { SchemaBase } from "./schemaBase";

/** Schema that accepts a boolean (true or false)*/
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
	 * @returns {{valid:boolean, msg:string}}
	 */
	check(data) {
		const result = {valid: false, msg:""};

		if (data.params[this.getName()] == undefined) {
			result.msg = `Missing parameter "${this.getName()}"`;
			return result;
		}

		const value = data.params[this.getName()];
		if (typeof(value) != "boolean") {
			result.msg = `Value set in parameter "${this.getName()}" is not a boolean (true or false)`;
			return result;
		}

		result.valid = true;
		return result;
	}
}