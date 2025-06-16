import { Mod } from "shapez/mods/mod";
//import { Vector } from "shapez/core/vector";
//import { gMetaBuildingRegistry } from "shapez/core/global_registries";
import { CoordsGrid } from "./descriptors/coordsGrid";
import { ActionsController } from "./actions/controllers/actionsController";
const DEFAULT_URL = "localhost:8000";

/** @type {import("shapez/game/root").GameRoot} */
let rootGame;

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
			rootGame = root;
		});

		this.signals.stateEntered.add(state	=> {
			if (this.#booted) {
				this.#actionsController.notifyStateChange(state);
			}
		});
	}

	/*
	ActionTest() {
		const metaBuild = gMetaBuildingRegistry.findByClass(rootGame.hud.parts.buildingsToolbar.allBuildings[0])

		console.log("Building! " + metaBuild);
		rootGame.hud.parts.buildingsToolbar.selectBuildingForPlacement(metaBuild)

		rootGame.hud.parts.buildingPlacer.tryPlaceCurrentBuildingAt(new Vector(50, 0));
	}

	//this.modInterface.extendClass(HUDBuildingPlacerLogic, AutoBuilder);
	const actionButton = document.createElement("div");
	actionButton.id = "neuro_action_test";
	document.body.appendChild(actionButton);

	const button = document.createElement("button");
	button.classList.add("styledButton");
	button.innerText = "Test action!";
	button.addEventListener("click", () => {
		console.log("click");
		this.ActionTest();
	});
	actionButton.appendChild(button);

	const actions = [SdkActionList.PLAY_GAME];
	SdkClient.removeActions(actions);
	SdkClient.sendMessage(
		"The game has loaded. Have fun.",
		true,
	);
	*/

	#SaveDefaultSettings() {
		this.settings.socketURL = DEFAULT_URL;
		this.saveSettings();
	}
}
