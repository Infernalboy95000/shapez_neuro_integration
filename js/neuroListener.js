// @ts-ignore
import { NeuroClient } from 'neuro-game-sdk';
// Private constants
const GAME_NAME = 'Shapez';
const MAX_RETRIES = 3;

// Private variables
let connected = false;
let socketURL = "";
let retries = 0;

export class NeuroListener {
	static tryConnect(URL) {
		if (this.neuroClient) {
			this.neuroClient.disconnect();
			this.neuroClient.onConnected = () => { };
			this.neuroClient.onClose = () => { };
			this.neuroClient.onError = () => { };
		}

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
			this.neuroClient.onClose = () => { NeuroListener.onClosed(); };
			this.neuroClient.onError = () => { NeuroListener.onErrored(); };
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

	static disconnect() {
		if (this.neuroClient) {
			this.neuroClient.disconnect();
			this.neuroClient = null;
			connected = false;
			socketURL = "";
			if (NeuroListener.disconnected) {
				NeuroListener.disconnected();
			}
		}
	}

	static isConnected() {
		return connected;
	}

	static getRetriesFormatted() {
		return `${retries}/${MAX_RETRIES}`;
	}

	static getCurrentURL() {
		return socketURL;
	}

	static onConnected() {
		connected = true;
		if (NeuroListener.connected) {
			NeuroListener.connected();
		}
	}

	static onClosed() {
		if (connected) {
			connected = false;
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
			socketURL = "";

			if (NeuroListener.failed) {
				NeuroListener.failed()
			}
		}
	}

	static onInitCrashed() {
		connected = false;
		socketURL = "";
		if (NeuroListener.initCrash) {
			NeuroListener.initCrash()
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
