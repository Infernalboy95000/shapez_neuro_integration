import { Mod } from "shapez/mods/mod";
import { CoordsGrid } from "./helpers/coordsGrid";
import { ActionsController } from "./actions/base/actionsController";
import { TutorialMessager } from "./helpers/tutorialMessager";
import { EventsController } from "./events/eventsController";
import { DefaultSettings } from "./defaultSettings";

export class NeuroIntegration extends Mod {
	/** @type {boolean} */ #booted = false;
	/** @type {CoordsGrid} */ #coordsGrid;
	/** @type {TutorialMessager} */ #tutorialMessager;
	/** @type {ActionsController} */ #actionsController;
	/** @type {EventsController} */ #eventsController;

	init() {
		DefaultSettings.Set(this);

		this.signals.appBooted.add(() => {
			this.#coordsGrid = new CoordsGrid(this);
			this.#tutorialMessager = new TutorialMessager(this);
			this.#actionsController = new ActionsController(this);
			this.#eventsController = new EventsController(this);
			this.#booted = true;
		});

		this.signals.gameStarted.add(root => {
			this.#actionsController.newGameOpenned(root);
			this.#eventsController.updateRoot(root);
		});

		this.signals.stateEntered.add(state	=> {
			if (this.#booted) {
				this.#actionsController.notifyStateChange(state);
				this.#tutorialMessager.notifyStateChange(state);
			}
		});
	}

	/**
	 * @param {string} message
	 * @returns {boolean}
	 * */
	trySendTutorialMessage(message) {
		return this.#tutorialMessager.TryAnnounceWithTutorial(message);
	}
}
