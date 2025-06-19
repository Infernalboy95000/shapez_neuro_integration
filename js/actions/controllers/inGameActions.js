import { SdkClient } from "../../sdkClient";
import { EnumSchema } from "../definitions/schema/enumSchema";
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
				this.#actions.removeAction(InGameActionList.STOP_PLACEMENT);
				return true;
			default:
				return false;
		}
	}

	/** @param {("SELECTED" | "DESELECTED" | "LOCKED")} result */
	#tellSelectionResult(action, result) {
		switch (result) {
			case "SELECTED":
				SdkClient.tellActionResult(
					action.id, true, `${action.params.buildings} building is selected`
				)
				this.#actions.addAction(InGameActionList.STOP_PLACEMENT);
				break;
			case "DESELECTED":
				SdkClient.tellActionResult(
					action.id, true, `${action.params.buildings} building is deselected. (It was already selected)`
				)
				this.#actions.removeAction(InGameActionList.STOP_PLACEMENT);
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
		
		//this.#promptRotation();
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

	/*
	#promptRotation() {
		const rotations = ["UP", "DOWN", "LEFT", "RIGHT"];
		const rotSchema = new EnumSchema("rotation", rotations);
		InGameActionList.ROTATE_BUILDING.setOptions([rotSchema]);
		this.#actions.addAction(InGameActionList.ROTATE_BUILDING);
	}
	*/
}