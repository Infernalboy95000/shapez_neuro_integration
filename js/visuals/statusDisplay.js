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

	/**
	 * @param {string} text
	 * @param {string} className
	 * */
	setText(text, className) {
		if (this.#display) {
			this.#display.textContent = text;
			this.#display.className = className;
		}
	}

	/** @param {Element} parent */
	#create(parent) {
		this.#display = document.createElement("div");
		this.#display.id = "sdk_client_status_display";
		parent.appendChild(this.#display);
		this.#refreshStatus();
	}

	#connectEvents() {
		SdkClient.connected.add("statusCon", () => { this.#onConnected() });
		SdkClient.disconnected.add("statusDis",() => { this.#onDisconnected() });
		SdkClient.reattempting.add("statusReat",() => { this.#onReattempting() });
		SdkClient.closed.add("statusClo",() => { this.#onClosed() });
		SdkClient.failed.add("statusFail",() => { this.#onFailed() });
		SdkClient.initCrash.add("statusKo",() => { this.#onInitCrash() });
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
		const reattempts = SdkClient.getRetriesFormatted();
		if (reattempts.includes("0")) {
			this.#display.textContent = `Connecting...`;
		}
		else {
			this.#display.textContent = `Connecting... (${reattempts})`;
		}
		this.#display.className = "attempting";
	}

	#onFailed() {
		this.#display.textContent = "Failed to connect!";
		this.#display.className = "error";
	}

	#onClosed() {
		this.#onDisconnected();
	}

	#onInitCrash() {
		this.#display.textContent = "Error on URL format!";
		this.#display.className = "error";
	}
}