import { DialogEvents } from "./dialogEvents";
import { InGameEvents } from "./inGameEvents";
import { OverlayEvents } from "./overlayEvents";

export class EventsController {
	/** @type {InGameEvents} */ #inGameEvents;
	/** @type {OverlayEvents} */ #overlayEvents;
	/** @type {DialogEvents} */ #dialogEvents;

	/** @param {import("../main").NeuroIntegration} mod */
	constructor(mod) {
		this.#inGameEvents = new InGameEvents(mod);
		this.#overlayEvents = new OverlayEvents(mod);
		this.#dialogEvents = new DialogEvents(mod);
	}

	/** @param {import("shapez/game/root").GameRoot} root */
	updateRoot(root) {
		this.#inGameEvents.updateRoot(root);
		this.#overlayEvents.updateRoot(root);
	}
}