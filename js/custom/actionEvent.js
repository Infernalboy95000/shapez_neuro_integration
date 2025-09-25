export class ActionEvent {
	/** @type {Map<string, CallableFunction>} */ #callbacks = new Map();

	/**
	 * @param {string} key
	 * @param {CallableFunction} callable */
	add(key, callable) {
		this.#callbacks.set(key, callable);
	}

	/** @param {string} key */
	remove(key) {
		this.#callbacks.delete(key);
	}

	invoke(attribute) {
		this.#callbacks.forEach((callback) => {
			callback(attribute);
		})
	}
}