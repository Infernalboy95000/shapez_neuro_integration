import { Mod } from "shapez/mods/mod";
import { Vector } from "shapez/core/vector";
import { gMetaBuildingRegistry } from "shapez/core/global_registries";
import { SettingsMenu } from "./settings/settingsMenu";
import { CoordsGrid } from "./descriptors/coordsGrid";
import { OpenGameAction } from "./actions/menu/openGameAction";
import { SdkActionList } from "./actions/sdkActionList";
import { NeuroListener } from "./neuroListener";
const DEFAULT_URL = "localhost:8000";

/** @type {import("shapez/game/root").GameRoot} */
let rootGame;

class NeuroIntegration extends Mod {
	init() {
		if (this.settings.socketURL == undefined) {
			this.SaveDefaultSettings();
		}

		this.signals.gameInitialized.add(root => {
			rootGame = root;
			this.coordsGrid = new CoordsGrid(this);
		})

		this.signals.stateEntered.add(state	=> {
			if (state.key == "MainMenuState") {
				this.openGameAction = new OpenGameAction(this, rootGame, state);
			}
			else if (state.key == "SettingsState") {
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

				const actions = [SdkActionList.PLAY_GAME];
				NeuroListener.removeActions(actions);
				NeuroListener.sendMessage(
					"The game has loaded. Have fun.",
					true,
				);
			}
		});
	}

	ActionTest() {
		const metaBuild = gMetaBuildingRegistry.findByClass(rootGame.hud.parts.buildingsToolbar.allBuildings[0])

		console.log("Building! " + metaBuild);
		rootGame.hud.parts.buildingsToolbar.selectBuildingForPlacement(metaBuild)

		rootGame.hud.parts.buildingPlacer.tryPlaceCurrentBuildingAt(new Vector(50, 0));
	}

	SaveDefaultSettings() {
		this.settings.socketURL = DEFAULT_URL;
		this.saveSettings();
	}
}
