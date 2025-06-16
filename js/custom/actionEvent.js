export class ActionEvent {
	/** @type {Array<CallableFunction>} */ #callbacks = new Array();

	/** @param {CallableFunction} callable */
	add(callable) {
		this.#callbacks.push(callable);
	}

	invoke(attribute) {
		for (let i = 0; i < this.#callbacks.length; i++) {
			this.#callbacks[i](attribute);
		}
	}
}