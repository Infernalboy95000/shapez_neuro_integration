import { BaseActions } from "./baseActions";

export class ActionsCollection {
	/** @type {Map<string, BaseActions>} */
	static #actions = new Map();

	/** @param {Map<string, BaseActions>} actions */
	static addActions(actions) {
		actions.forEach((baseAction, key) => {
			this.#actions.set(key, baseAction);
		})
	}

	/** @param {Array<string>} actionKeys */
	static activateActions(actionKeys) {
		for (let i = 0; i < actionKeys.length; i++) {
			if (this.#actions.has(actionKeys[i])) {
				this.#actions.get(actionKeys[i]).activate();
			}
		}
	}

	/** @param {Array<string>} actionKeys */
	static deactivateActions(actionKeys, remove = false) {
		for (let i = 0; i < actionKeys.length; i++) {
			if (this.#actions.has(actionKeys[i])) {
				this.#actions.get(actionKeys[i]).deactivate();
				if (remove) {
					this.#actions.delete(actionKeys[i]);
				}
			}
		}
	}

	/** @returns {{valid:boolean, msg:string}} */
	static tryPlayerAction(action) {
		let result = null;
		this.#actions.forEach((baseAction) => {
			if (result == null) {
				result = baseAction.tryAction(action);
			}
		})

		if (result == null) {
			result = {valid:false, msg:"Unknown action."};
		}

		return result;
	}
}