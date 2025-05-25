import { Mod } from "shapez/mods/mod";
import { Vector } from "shapez/core/vector";
import { gMetaBuildingRegistry } from "shapez/core/global_registries";
import { SettingsMenu } from "./settings/settingsMenu";
import { MapView } from "shapez/game/map_view";
import { MapChunkAggregate } from "shapez/game/map_chunk_aggregate";
import { MapChunkView } from "shapez/game/map_chunk_view";
const DEFAULT_URL = "localhost:8000";

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

		// Those are the zoomed out chunk coordinates
		/*
		this.modInterface.runAfterMethod(MapChunkAggregate, "drawOverlay", function(parameters) {
			console.log(`Coords -> X: ${this.x}, Y: ${this.y}`);
		});
		*/

		this.modInterface.runAfterMethod(MapChunkView, "drawForegroundStaticLayer", function(parameters) {
			const chunkWidth = this.worldSpaceRectangle.w / this.tileSpaceRectangle.w;
			const chunkHeight = this.worldSpaceRectangle.h / this.tileSpaceRectangle.h;
			
			const context = parameters.context;
			context.fillStyle = "rgb(113, 213, 202)";
			context.shadowColor = "rgb(129, 163, 159)";
			context.shadowOffsetX = 1.5;
			context.shadowOffsetY = 1.5;
			context.shadowBlur = 1;
			context.font = "6px GameFont";

			for (let i = 0; i < this.tileSpaceRectangle.w; i++) {
				for (let j = 0; j < this.tileSpaceRectangle.h; j++) {
					context.fillText(`x: ${this.tileX + i}`, this.worldSpaceRectangle.x + (i * chunkWidth), this.worldSpaceRectangle.y + (j * chunkHeight) - 8, chunkWidth);
					context.fillText(`y: ${this.tileY + j}`, this.worldSpaceRectangle.x + (i * chunkWidth), this.worldSpaceRectangle.y + (j * chunkHeight) - 2, chunkWidth);
				}
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
