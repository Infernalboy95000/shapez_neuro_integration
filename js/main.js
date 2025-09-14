import { Mod } from "shapez/mods/mod";
import { CoordsGrid } from "./helpers/coordsGrid";
import { ActionsController } from "./actions/base/actionsController";
import { TutorialMessager } from "./helpers/tutorialMessager";
import { EventsController } from "./events/eventsController";
import { ModSettings } from "./modSettings";
import { ViewScanner } from "./actions/descriptors/camera/viewScanner";

export class NeuroIntegration extends Mod {
	/** @type {boolean} */ #booted = false;
	/** @type {CoordsGrid} */ #coordsGrid;
	/** @type {TutorialMessager} */ #tutorialMessager;
	/** @type {ActionsController} */ #actionsController;
	/** @type {EventsController} */ #eventsController;

	init() {
		ModSettings.defaults(this);

		this.signals.appBooted.add(() => {
			this.#coordsGrid = new CoordsGrid(this);
			this.#tutorialMessager = new TutorialMessager(this);
			this.#actionsController = new ActionsController(this);
			this.#eventsController = new EventsController(this);
			this.#booted = true;
		});

		this.signals.gameStarted.add(root => {
			ViewScanner.asignRoot(root);
			this.#actionsController.newGameOpenned(root);
			this.#eventsController.updateRoot(root);
			this.#tutorialMessager.notifyGameOpenned();
		});

		this.signals.stateEntered.add(state	=> {
			if (this.#booted) {
				this.#actionsController.notifyStateChange(state);
				this.#tutorialMessager.notifyStateChange(state);
			}
		});
	}
}
