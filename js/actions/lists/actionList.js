import { SdkClient } from "../../sdkClient";
import { SdkAction } from "../../sdkActions/sdkAction";

export class ActionList {
	/** @type {Map<string, SdkAction>} */ #actions = new Map();
	/** @type {boolean} */ #active = false;

	/** @param {SdkAction} action */
	addAction(action) {
		this.#actions.set(action.getName(), action);
		if (this.#active) {
			SdkClient.registerActions([action]);
		}
	}

	/** @param {SdkAction} action */
	removeAction(action) {
		if (this.#active && this.#actions.has(action.getName())) {
			SdkClient.removeActions([action.getName()]);
		}
		this.#actions.delete(action.getName());
	}

	removeAllActions() {
		if (this.#active && this.#actions.size > 0) {
			SdkClient.removeActions(Array.from(this.#actions.keys()));
		}
		this.#actions.clear();
	}

	activateActions() {
		if (!this.#active && this.#actions.size > 0) {
			SdkClient.registerActions(Array.from(this.#actions.values()));
		}
		this.#active = true;
	}

	deactivateActions() {
		if (this.#active && this.#actions.size > 0) {
			SdkClient.removeActions(Array.from(this.#actions.keys()));
		}
		this.#active = false;
	}
}