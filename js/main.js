import { Mod } from "shapez/mods/mod";
import { CoordsGrid } from "./descriptors/coordsGrid";
import { ActionsController } from "./actions/controllers/actionsController";
const DEFAULT_URL = "localhost:8000";

class NeuroIntegration extends Mod {
	/** @type {boolean} */ #booted = false;
	/** @type {CoordsGrid} */ #coordsGrid;
	/** @type {ActionsController} */ #actionsController;

	init() {
		if (this.settings.socketURL == undefined) {
			this.#SaveDefaultSettings();
		}

		this.signals.appBooted.add(() => {
			this.#coordsGrid = new CoordsGrid(this);
			this.#actionsController = new ActionsController(this);
			this.#booted = true
		});

		this.signals.gameInitialized.add(root => {
			this.#actionsController.newGameOpenned(root);
		});

		this.signals.stateEntered.add(state	=> {
			if (this.#booted) {
				this.#actionsController.notifyStateChange(state);
			}
		});
	}

	#SaveDefaultSettings() {
		this.settings.socketURL = DEFAULT_URL;
		this.saveSettings();
	}
}
