import { SdkClient } from "../sdkClient";

export class StatusDisplay {
	/** @type {HTMLDivElement} */ #display;

	constructor() {
		this.#connectEvents();
	}

	/** @param {Element} parent */
	show(parent) {
		if (this.#display) {
			this.#display.remove();
		}
		this.#create(parent);
	}

	/** @param {Element} parent */
	#create(parent) {
		this.#display = document.createElement("div");
		this.#display.id = "sdk_client_status_display";
		parent.appendChild(this.#display);
		this.#refreshStatus();
	}

	#connectEvents() {
		SdkClient.connected.add(() => { this.#onConnected() });
		SdkClient.disconnected.add(() => { this.#onDisconnected() });
		SdkClient.reattempting.add(() => { this.#onReattempting() });
		SdkClient.closed.add(() => { this.#onClosed() });
		SdkClient.failed.add(() => { this.#onFailed() });
		SdkClient.initCrash.add(() => { this.#onInitCrash() });
	}

	#refreshStatus() {
		if (SdkClient.isConnected()) {
			this.#onConnected();
		}
		else if (SdkClient.isAttempting()) {
			this.#onReattempting();
		}
		else {
			this.#onDisconnected();
		}
	}

	#onConnected() {
		this.#display.textContent = "Connected";
		this.#display.className = "connected";
	}

	#onDisconnected() {
		this.#display.textContent = "Disconnected";
		this.#display.className = "error";
	}

	#onReattempting() {
		this.#display.textContent = `Connecting... (${SdkClient.getRetriesFormatted()})`;
		this.#display.className = "attempting";
	}

	#onFailed() {
		this.#onDisconnected();
	}

	#onClosed() {
		this.#onDisconnected();
	}

	#onInitCrash() {
		this.#onDisconnected();
	}
}