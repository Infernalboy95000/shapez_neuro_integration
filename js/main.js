import { Mod } from "shapez/mods/mod";
import { Vector } from "shapez/core/vector";
import { gMetaBuildingRegistry } from "shapez/core/global_registries";
import { SettingsMenu } from "./settings/settingsMenu";
const DEFAULT_URL = "ws://localhost:8000";

/** @type {import("shapez/game/root").GameRoot} */
let rootGame;

class NeuroIntegration extends Mod {
	init() {
		if (this.settings.socketURL == undefined) {
			this.settings.socketURL = DEFAULT_URL;
			this.saveSettings();
		}

		this.signals.gameInitialized.add(root => {
			rootGame = root;
		})

		this.signals.stateEntered.add(state	=> {
			if (state.key == "SettingsState") {
				this.settingsMenu = new SettingsMenu(this, rootGame);
			}

			else if (state.key == "InGameState") {
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
			}
		});
	}

	ActionTest() {
		const metaBuild = gMetaBuildingRegistry.findByClass(rootGame.hud.parts.buildingsToolbar.allBuildings[0])

		console.log("Building! " + metaBuild);
		rootGame.hud.parts.buildingsToolbar.selectBuildingForPlacement(metaBuild)

		rootGame.hud.parts.buildingPlacer.tryPlaceCurrentBuildingAt(new Vector(50, 0));
	}
}
