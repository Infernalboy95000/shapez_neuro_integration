// @ts-ignore
import { NeuroClient } from 'neuro-game-sdk';
// Private constants
const GAME_NAME = 'Shapez';
const MAX_RETRIES = 3;

// Private variables
let connected;
let socketURL;
let retries;

export class NeuroListener {
	constructor(URL) {
		socketURL = URL;
	}

	static tryConnect() {
		connected = false;
		retries = 0;
		this.neuroClient = new NeuroClient(socketURL, GAME_NAME, () => { NeuroListener.onConnected(); });
		this.neuroClient.onClose = () => { NeuroListener.onClosed(); };
		this.neuroClient.onError = () => { NeuroListener.onErrored(); };
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
			if (NeuroListener.disconnect) {
				NeuroListener.disconnect();
			}
		}
	}

	static isConnected() {
		return connected;
	}

	static getRetriesFormatted() {
		return `${retries}/${MAX_RETRIES}`;
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

			if (NeuroListener.failed) {
				NeuroListener.failed()
			}
		}
	}
}
// Public events
NeuroListener.connected = undefined;
NeuroListener.disconnected = undefined;
NeuroListener.reattempting = undefined;
NeuroListener.closed = undefined;
NeuroListener.failed = undefined;
