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
			case InGameActionList.PLACE_BUILDING.getName():
				if (this.#trySinglePlacement(action)) {
					this.#announceSinglePlacement(action);
				}
				return true;
			case InGameActionList.PLACE_BUILDINGS_LINE.getName():
				this.#tryLinePlacement(action);
				return true;
			default:
				return false;
		}
	}

	/** @retuns {boolean} */
	#trySinglePlacement(action) {
		return (
			this.#trySelectBuilding(action) &&
			this.#tryRotateBuilding(action) &&
			this.#tryPlaceSingleBuilding(action)
		)
	}

	/** @retuns {boolean} */
	#tryLinePlacement(action) {
		if (
			this.#trySelectBuilding(action) &&
			this.#tryRotateBuilding(action)
		) {
			const result = this.#tryPlaceBuildingLine(action);
			this.#announceLanePlacement(action, result);
		}
	}

	/** @retuns {boolean} */
	#trySelectBuilding(action) {
		if (!this.#builder.selectBuilding(action.params.building)) {
			SdkClient.tellActionResult(
				action.id, false, `${action.params.building} is not unlocked, yet.`
			)
			return false;
		}
		return true;
	}

	/** @retuns {boolean} */
	#tryRotateBuilding(action) {
		if (!this.#builder.rotateBuilding(action.params.rotation)) {
			SdkClient.tellActionResult(
				action.id, false, `${action.params.rotation} is not a valid rotation.`
			)
			return false;
		}
		return true;
	}

	/** @retuns {boolean} */
	#tryPlaceSingleBuilding(action) {
		if (!this.#builder.placeBuilding(
			action.params.x_position, action.params.y_position
		)) {
			SdkClient.tellActionResult(
				action.id, false, `Cannot place ${action.params.building} ` +
				`at x: ${action.params.x_position}, y: ${action.params.y_position}. ` +
				`Its probably overlapping another building.`
			)
		}
		return true;
	}

	/** @retuns {("ALL"|"SOME"|"NONE")} */
	#tryPlaceBuildingLine(action) {
		let placedAll = true;
		let placedSome = false;
		let currentPos = [action.params.x_position, action.params.y_position];

		for (let i = 0; i < action.params.line_length; i++) {
			if (this.#builder.placeBuilding(currentPos[0], currentPos[1])) {
				placedSome = true;
			}
			else {
				placedAll = false;
			}
			currentPos = RandomUtils.vectorAddDir(currentPos, action.params.direction);
		}
		
		if (placedAll) { return "ALL"; }
		else if (placedSome) { return "SOME"; }
		else { return "NONE"; }
	}

	#announceSinglePlacement(action) {
		const buildName = RandomUtils.capitalizeFirst(action.params.building);
		SdkClient.tellActionResult(
			action.id, true, `${buildName} has been built ` +
			`at x: ${action.params.x_position}, y: ${action.params.y_position}.`
		)
	}

	/** @param {("ALL"|"SOME"|"NONE")} result */
	#announceLanePlacement(action, result) {
		const buildName = RandomUtils.capitalizeFirst(action.params.building);
		const startPos = [action.params.x_position, action.params.y_position];
		const endPos = RandomUtils.vectorAddDir([action.params.x_position, action.params.y_position], action.params.direction, action.params.line_length);
		switch (result) {
			case "ALL":
				SdkClient.tellActionResult(
					action.id, true, `A line of ${buildName} has been fully built ` +
					`starting at x: ${startPos[0]}, y: ${startPos[1]} ` +
					`and ending at x: ${endPos[0]}, y: ${endPos[1]}.`
				)
				break;
			case "SOME":
				SdkClient.tellActionResult(
					action.id, true, `A line of ${buildName} has been partially built ` +
					`starting at x: ${startPos[0]}, y: ${startPos[1]} ` +
					`and ending at x: ${endPos[0]}, y: ${endPos[1]}. ` +
					`Some pieces are missing in between, probably because there are other buildings beeing there.`
				)
				break;
			case "NONE":
				SdkClient.tellActionResult(
					action.id, false, `Cannot place ${buildName} ` +
					`from x: ${startPos[0]}, y: ${startPos[1]} ` +
					`to x: ${endPos[0]}, y: ${endPos[1]}. ` +
					`Maybe it's full of other buildings over there.`
				)
				break;
		}
	}

	#promptActions() {
		this.#promptPlacers();
	}

	#promptPlacers() {
		const buildingNames = this.#builder.getBuildingNames();
		const buildings = new EnumSchema("building", buildingNames);

		const posX = new NumberSchema("x_position", 1, -1000000, 1000000);
		const posY = new NumberSchema("y_position", 1, -1000000, 1000000);

		const rotNames = ["UP", "DOWN", "LEFT", "RIGHT"];
		const rotations = new EnumSchema("rotation", rotNames);

		const direction = new EnumSchema("direction", rotNames);
		const lineLength = new NumberSchema("line_length", 1, 2, 1000);

		const direction2 = new EnumSchema("direction2", rotNames, false);
		const lineLength2 = new NumberSchema("line_length2", 1, 1, 1000, false);

		InGameActionList.PLACE_BUILDING.setOptions(
			[buildings, posX, posY, rotations]
		);
		this.#actions.addAction(InGameActionList.PLACE_BUILDING);

		InGameActionList.PLACE_BUILDINGS_LINE.setOptions(
			[buildings, posX, posY, rotations, direction, lineLength]
		);
		this.#actions.addAction(InGameActionList.PLACE_BUILDINGS_LINE);

		InGameActionList.BELT_PLANNER.setOptions(
			[buildings, posX, posY, direction, lineLength, direction2, lineLength2]
		);
		//this.#actions.addAction(InGameActionList.BELT_PLANNER);
	}
}