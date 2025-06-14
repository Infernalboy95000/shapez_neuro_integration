// @ts-ignore
import { NeuroClient } from 'neuro-game-sdk';
import { SdkAction } from './actions/register/sdkAction';
// Private constants
const GAME_NAME = 'Shapez';
const MAX_RETRIES = 3;

// Private variables
let connected = false;
let attempting = false;
let socketURL = "";
let retries = 0;

export class NeuroListener {
	static tryConnect(URL) {
		if (!URL) {
			NeuroListener.onInitCrashed();
			return false;
		}
		else if (/^ws{1,2}:{1}\/{2}/.test(URL)) {
			socketURL = URL;
		}
		else if (/^.+:{1}\/+/.test(URL)) {
			NeuroListener.onInitCrashed();
			return false;
		}
		else {
			socketURL = "ws://" + URL;
		}
		connected = false;
		retries = 0;

		try {
			this.neuroClient = new NeuroClient(
				socketURL, GAME_NAME, () => { NeuroListener.onConnected(); }
			);
			attempting = true;
			this.neuroClient.onClose = () => { NeuroListener.onClosed(); };
			this.neuroClient.onError = () => { NeuroListener.onErrored(); };
			this.neuroClient.onAction((e) => NeuroListener.onAction(e));
		}
		catch {
			NeuroListener.onInitCrashed();
			return false;
		}
		return true;
	}

	static retryConnection() {
		if (this.neuroClient) {
			this.neuroClient.connect(() => { NeuroListener.onConnected(); });
			if (NeuroListener.reattempting) {
				NeuroListener.reattempting();
			}
		}
		else {
			NeuroListener.tryConnect();
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
			if (NeuroListener.disconnected) {
				NeuroListener.disconnected();
			}
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

	static onConnected() {
		connected = true;
		attempting = false;
		if (NeuroListener.connected) {
			NeuroListener.connected();
		}
	}

	static onClosed() {
		if (connected) {
			connected = false;
			attempting = false;
			socketURL = "";
			if (NeuroListener.closed) {
				NeuroListener.closed();
			}
		}
	}

	static onErrored() {
		if (retries < MAX_RETRIES) {
			retries++;
			NeuroListener.retryConnection();
		}
		else {
			this.neuroClient = null;
			connected = false;
			attempting = false;
			socketURL = "";

			if (NeuroListener.failed) {
				NeuroListener.failed()
			}
		}
	}

	static onInitCrashed() {
		connected = false;
		attempting = false;
		socketURL = "";
		if (NeuroListener.initCrash) {
			NeuroListener.initCrash()
		}
	}

	static onAction(msg) {
		if (NeuroListener.action) {
			NeuroListener.action(msg);
		}
	}
}
// Public events
NeuroListener.connected = undefined;
NeuroListener.disconnected = undefined;
NeuroListener.reattempting = undefined;
NeuroListener.closed = undefined;
NeuroListener.failed = undefined;
NeuroListener.initCrash = undefined;
NeuroListener.action = undefined;
