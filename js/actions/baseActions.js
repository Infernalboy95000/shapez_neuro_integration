import { SchemaBase } from "../sdkActions/schema/schemaBase";
import { SdkAction } from "../sdkActions/sdkAction";
import { SdkClient } from "../sdkClient";

export class BaseActions {
	/** @type {Map<string, {action:SdkAction, function:CallableFunction}>} */
	#actions = new Map();

	/** @param {Array<SdkAction>} actions */
	constructor(actions) {
		if (this.constructor === BaseActions) {
			throw new Error("Can't instantiate abstract class!");
		}

		for (let i = 0; i < actions.length; i++) {
			this.#actions.set(actions[i].getName(), {
				action: actions[i],
				function: null,
			});
		}
	}

	/** @param {Map<string, CallableFunction>} callables */
	addCallables(callables) {
		callables.forEach((value, key) => {
			if (this.#actions.has(key)) {
				const action = this.#actions.get(key);
				action.function = value;
				this.#actions.set(key, action);
			}
		});
	}

	/** @param {Map<string, Array<SchemaBase>>} options */
	setOptions(options) {
		options.forEach((value, key) => {
			if (this.#actions.has(key)) {
				const action = this.#actions.get(key);
				action.action.setOptions(value);
				this.#actions.set(key, action);
			}
		});
	}

	/** @param {Array<string>} actionNames */
	activate(actionNames = []) {
		SdkClient.registerActions(this.#getActionsArray(actionNames));
	}

	deactivate() {
		SdkClient.removeActions(this.#getKeysArray());
	}

	/**
	 * @param {{id:string,name:string,params:{}}} data
	 * @returns {{valid:boolean, msg:string}}
	 */
	tryAction(data) {
		if (this.#actions.has(data.name)) {
			const obj = this.#actions.get(data.name);
			const response = obj.action.checkResponse(data);
			if (response.valid) {
				return obj.function(data.params);
			}
			else {
				return response;
			}
		}
		else {
			return null;
		}
	}

	/**
	 * @param {Array<string>} filter
	 * @returns {Array<SdkAction>}
	 * */
	#getActionsArray(filter = []) {
		const actions = [];
		this.#actions.forEach((value, key) => {
			if (filter.length <= 0 || filter.includes(key))
			actions.push(value.action);
		});
		return actions;
	}

	/** @returns {Array<string>} */
	#getKeysArray() {
		const keys = [];
		this.#actions.forEach((_, key) => {
			keys.push(key);
		});
		return keys;
	}
}