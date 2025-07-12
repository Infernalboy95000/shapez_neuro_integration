import { NeuroClient } from 'neuro-game-sdk';
import { SdkAction } from './actions/definitions/sdkAction';
import { ActionEvent } from './custom/actionEvent';
// Private constants
const GAME_NAME = 'Shapez';
const MAX_RETRIES = 3;

// Private variables
let connected = false;
let attempting = false;
let socketURL = "";
let retries = 0;

export class SdkClient {
	static tryConnect(URL) {
		if (!URL) {
			SdkClient.#onInitCrashed();
			return false;
		}
		else if (/^ws{1,2}:{1}\/{2}/.test(URL)) {
			socketURL = URL;
		}
		else if (/^.+:{1}\/+/.test(URL)) {
			SdkClient.#onInitCrashed();
			return false;
		}
		else {
			socketURL = "ws://" + URL;
		}
		connected = false;
		retries = 0;

		try {
			this.neuroClient = new NeuroClient(
				socketURL, GAME_NAME, () => { SdkClient.#onConnected(); }
			);
			attempting = true;
			this.neuroClient.onClose = () => { SdkClient.#onClosed(); };
			this.neuroClient.onError = () => { SdkClient.#onErrored(); };
			this.neuroClient.onAction(e => { SdkClient.#onAction(e); });
		}
		catch {
			SdkClient.#onInitCrashed();
			return false;
		}
		return true;
	}

	static retryConnection() {
		if (this.neuroClient) {
			SdkClient.reattempting.invoke();
		}
		else {
			SdkClient.tryConnect();
		}
	}

	static requestCancell() {
		retries = MAX_RETRIES;
	}

	static disconnect() {
		if (this.neuroClient) {
			this.neuroClient.disconnect();
			this.neuroClient = null;
			connected = false;
			attempting = false;
			socketURL = "";
			SdkClient.disconnected.invoke();
		}
	}

	static sendMessage(msg, silent = false) {
		if (connected) {
			this.neuroClient.sendContext(msg, silent);
		}
	}

	/** @param {Array<SdkAction>} actions */
	static registerActions(actions) {
		if (connected) {
			const actionsSchemas = new Array();
			for (let i = 0; i < actions.length; i++) {
				actionsSchemas.push(actions[i].build());
			}
			this.neuroClient.registerActions(actionsSchemas);
		}
	}

	/** @param {Array<string>} actionIds */
	static removeActions(actionIds) {
		if (connected) {
			this.neuroClient.unregisterActions(actionIds);
		}
	}

	/**
	 * @param {string} id
     * @param {boolean} success
     * @param {string} message
     */
	static tellActionResult(id, success, message = "") {
		if (connected) {
			this.neuroClient.sendActionResult(id, success, message);
		}
	}

	static isConnected() {
		return connected;
	}

	static isAttempting() {
		return attempting;
	}

	static getRetriesFormatted() {
		return `${retries}/${MAX_RETRIES}`;
	}

	static getCurrentURL() {
		return socketURL;
	}

	static #onConnected() {
		connected = true;
		attempting = false;
		SdkClient.connected.invoke();
	}

	static #onClosed() {
		if (connected) {
			connected = false;
			attempting = false;
			socketURL = "";
			SdkClient.closed.invoke();
		}
	}

	static #onErrored() {
		if (retries < MAX_RETRIES) {
			retries++;
			SdkClient.retryConnection();
		}
		else {
			this.neuroClient = null;
			connected = false;
			attempting = false;
			socketURL = "";

			SdkClient.failed.invoke();
		}
	}

	static #onInitCrashed() {
		connected = false;
		attempting = false;
		socketURL = "";
		SdkClient.initCrash.invoke();
	}

	static #onAction(msg) {
		SdkClient.action.invoke(msg);
	}
}
// Public events
SdkClient.connected = new ActionEvent();
SdkClient.disconnected = new ActionEvent();
SdkClient.reattempting = new ActionEvent();
SdkClient.closed = new ActionEvent();
SdkClient.failed = new ActionEvent();
SdkClient.initCrash = new ActionEvent();
SdkClient.action = new ActionEvent();
