import { SchemaBase } from "../sdkActions/schema/schemaBase";
import { SdkAction } from "../sdkActions/sdkAction";
import { SdkClient } from "../sdkClient";

export class BaseActions {
	/** @type {Map<string, {action:SdkAction, active:boolean, function:CallableFunction}>} */
	#actions = new Map();

	/** @param {Array<SdkAction>} actions */
	constructor(actions) {
		if (this.constructor === BaseActions) {
			throw new Error("Can't instantiate abstract class!");
		}

		for (let i = 0; i < actions.length; i++) {
			this.#actions.set(actions[i].getName(), {
				action: actions[i],
				active: false,
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
		SdkClient.registerActions(this.#getActionsToActivate(actionNames));
	}

	deactivate() {
		SdkClient.removeActions(this.#getKeysToDeactivate());
	}

	/**
	 * @param {{id:string,name:string,params:{}}} data
	 * @returns {{valid:boolean, msg:string}}
	 */
	tryAction(data) {
		if (this.#actions.has(data.name)) {
			const obj = this.#actions.get(data.name);
			if (!obj.active) {
				return {valid: false, msg: "You can't execute this action now"};
			}

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
	#getActionsToActivate(filter = []) {
		const actions = [];
		this.#actions.forEach((value, key) => {
			if (!value.active && (filter.length <= 0 || filter.includes(key))) {
				actions.push(value.action);
				value.active = true;
				this.#actions.set(key, value);
			}
		});

		return actions;
	}

	/** @returns {Array<string>} */
	#getKeysToDeactivate() {
		const keys = [];
		this.#actions.forEach((value, key) => {
			keys.push(key);
			value.active = false;
			this.#actions.set(key, value);
		});
		return keys;
	}
}