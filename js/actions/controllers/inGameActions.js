import { RandomUtils } from "../../custom/randomUtils";
import { SdkClient } from "../../sdkClient";
import { EnumSchema } from "../definitions/schema/enumSchema";
import { NumberSchema } from "../definitions/schema/numberSchema";
import { InGameBuilder } from "../executers/inGameBuilder";
import { ActionList } from "../lists/actionList";
import { InGameActionList } from "../lists/inGameActionList";

export class InGameActions {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ActionList} */ #actions;
	/** @type {InGameBuilder} */ #builder;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;
		this.#actions = new ActionList();
	}

	gameOpenned() {
		if (SdkClient.isConnected()) {
			this.#announceOpening();
			this.#builder = new InGameBuilder(this.#root);
			this.#actions.removeAllActions();
			this.#promptActions();
			this.#actions.activateActions();
		}
	}

	gameClosed() {
		this.#actions.deactivateActions();
	}

	playerSentAction(action) {
		if (!this.#isActionValid(action)) {
			SdkClient.tellActionResult(
				action.id, false,
				`Unknown action.`
			)
		}
	}

	#announceOpening() {
		SdkClient.sendMessage("A map has loaded. Now you can play the game!");
	}

	/** @retuns {boolean} */
	#isActionValid(action) {
		switch (action.name) {
			case InGameActionList.SELECT_BUILDING.getName():
				const result = this.#builder.selectBuilding(action.params.buildings);
				this.#tellSelectionResult(action, result);
				return true;
			case InGameActionList.STOP_PLACEMENT.getName():
				this.#builder.deselectCurrentBulding();
				SdkClient.tellActionResult(
					action.id, true, `Building deselected.`
				)
				this.#clearBuildingSelectedActions();
				return true;
			case InGameActionList.ROTATE_BUILDING.getName():
				if (this.#builder.rotateBuilding(action.params.rotation)) {
					SdkClient.tellActionResult(
						action.id, true, `Building rotated facing ${action.params.rotation}.`
					)
				}
				else {
					SdkClient.tellActionResult(
						action.id, false, `Failed to rotate the building.`
					)
				}
				return true;
			case InGameActionList.PLACE_BUILDING.getName():
				if (this.#builder.placeBuilding(action.params.x_position, action.params.y_position)) {
					SdkClient.tellActionResult(
						action.id, true, `Building placed succesfully.`
					)
				}
				else {
					SdkClient.tellActionResult(
						action.id, false, `Couldn't place the building.`
					)
				}
				return true;
			default:
				return false;
		}
	}

	/** @param {("SELECTED" | "DESELECTED" | "LOCKED")} result */
	#tellSelectionResult(action, result) {
		switch (result) {
			case "SELECTED":
				const buildName = RandomUtils.capitalizeFirst(action.params.buildings);
				//TODO: Current rotation cannot be in context easily because there's an option that stores the last rotation of a building and changes it after this call.
				//const rot = this.#builder.getCurrentRotation();
				SdkClient.tellActionResult(
					action.id, true, `${buildName} building is selected.`// +
					//`Is currently rotated facing ${rot}`
				)
				this.#promptBuildingSelectedActions();
				break;
			case "DESELECTED":
				SdkClient.tellActionResult(
					action.id, true, `${action.params.buildings} building is deselected. (It was already selected)`
				)
				this.#clearBuildingSelectedActions();
				break;
			case "LOCKED":
				SdkClient.tellActionResult(
					action.id, false, `${action.params.buildings} is not unlocked, yet.`
				)
				break;
			default:
				SdkClient.tellActionResult(
					action.id, false, `Unknown error.`
				)
				break;
		}
	}

	#promptActions() {
		this.#promptToolbelt();
		this.#prepareRotation();
		this.#preparePlacer();
	}

	#promptBuildingSelectedActions() {
		this.#actions.addAction(InGameActionList.STOP_PLACEMENT);
		this.#actions.addAction(InGameActionList.ROTATE_BUILDING);
		this.#actions.addAction(InGameActionList.PLACE_BUILDING);
	}

	#clearBuildingSelectedActions() {
		this.#actions.removeAction(InGameActionList.STOP_PLACEMENT);
		this.#actions.removeAction(InGameActionList.ROTATE_BUILDING);
		this.#actions.removeAction(InGameActionList.PLACE_BUILDING);
	}

	#promptToolbelt() {
		const buildingNames = [];
		const buildings = this.#builder.getToolbelt();
		for (let i = 0; i < buildings.length; i++) {
			buildingNames.push(buildings[i].getId());
		}

		const buildingsSchema = new EnumSchema("buildings", buildingNames);
		InGameActionList.SELECT_BUILDING.setOptions([buildingsSchema]);
		this.#actions.addAction(InGameActionList.SELECT_BUILDING);
	}

	#prepareRotation() {
		const rotations = ["UP", "DOWN", "LEFT", "RIGHT"];
		const rotSchema = new EnumSchema("rotation", rotations);
		InGameActionList.ROTATE_BUILDING.setOptions([rotSchema]);
	}

	#preparePlacer() {
		const posX = new NumberSchema("x_position", 1, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
		const posY = new NumberSchema("y_position", 1, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
		InGameActionList.PLACE_BUILDING.setOptions([posX, posY]);
	}
}