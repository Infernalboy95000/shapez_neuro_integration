import { Vector } from "shapez/core/vector";
import { RandomUtils } from "../../custom/randomUtils";
import { SdkClient } from "../../sdkClient";
import { EnumSchema } from "../definitions/schema/enumSchema";
import { NumberSchema } from "../definitions/schema/numberSchema";
import { InGameBuilder } from "../executers/inGameBuilder";
import { InGameMassSelector } from "../executers/inGameMassSelector";
import { MapDescriptor } from "../executers/mapDescriptor";
import { ActionList } from "../lists/actionList";
import { InGameActionList } from "../lists/inGameActionList";

export class InGameActions {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ActionList} */ #actions;
	/** @type {InGameBuilder} */ #builder;
	/** @type {InGameMassSelector} */ #massSelector;
	/** @type {MapDescriptor} */ #mapDescriptor;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;
		this.#actions = new ActionList();
		this.#mapDescriptor = new MapDescriptor(mod, root);
	}

	gameOpenned() {
		if (SdkClient.isConnected()) {
			this.#announceOpening();
			this.#builder = new InGameBuilder(this.#root);
			this.#massSelector = new InGameMassSelector(this.#root);
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
				this.#trySinglePlacementAction(action);
				return true;
			case InGameActionList.PLACE_BUILDINGS_LINE.getName():
				this.#tryLinePlacementAction(action);
				return true;
			case InGameActionList.DELETE_BUILDING.getName():
				this.#trySingleDeletionAction(action);
				return true;
			case InGameActionList.DELETE_IN_AREA.getName():
				this.#tryAreaDeletionAction(action);
				return true;
			case InGameActionList.PATCHES_NEARBY.getName():
				this.#tryDescribePatches(action);
				return true;
			default:
				return false;
		}
	}

	#trySinglePlacementAction(action) {
		if (
			this.#trySelectBuilding(action) &&
			this.#tryRotateBuilding(action) &&
			this.#tryPlaceSingleBuilding(action)
		) {
			this.#announceSinglePlacement(action);
		}
	}

	#tryLinePlacementAction(action) {
		if (
			this.#trySelectBuilding(action) &&
			this.#tryRotateBuilding(action)
		) {
			const result = this.#tryPlaceBuildingLine(action);
			this.#announceLanePlacement(action, result);
		}
	}

	#trySingleDeletionAction(action) {
		const msg = this.#builder.deleteBuilding(action.params.x_position, action.params.y_position);
		if (msg.includes("Success")) {
			SdkClient.tellActionResult(action.id, true, msg);
		}
		else {
			SdkClient.tellActionResult(action.id, false, msg);
		}
	}

	#tryAreaDeletionAction(action) {
		const msg = this.#massSelector.areaDelete(
			action.params.lower_corner_x_position,
			action.params.lower_corner_y_position,
			action.params.upper_corner_x_position,
			action.params.upper_corner_y_position,
		);

		if (msg.includes("Success")) {
			SdkClient.tellActionResult(action.id, true, msg);
		}
		else {
			SdkClient.tellActionResult(action.id, false, msg);
		}
	}

	#tryDescribePatches(action) {
		const msg = this.#mapDescriptor.describePatches();
		SdkClient.tellActionResult(action.id, true, msg);
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
		this.#promptDeleters();
		this.#promptDescriptors();
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

		InGameActionList.PLACE_BUILDING.setOptions(
			[buildings, posX, posY, rotations]
		);
		this.#actions.addAction(InGameActionList.PLACE_BUILDING);

		InGameActionList.PLACE_BUILDINGS_LINE.setOptions(
			[buildings, posX, posY, rotations, direction, lineLength]
		);
		this.#actions.addAction(InGameActionList.PLACE_BUILDINGS_LINE);
	}

	#promptDeleters() {
		const posX = new NumberSchema("x_position", 1, -1000000, 1000000);
		const posY = new NumberSchema("y_position", 1, -1000000, 1000000);

		const posX_1 = new NumberSchema("lower_corner_x_position", 1, -1000000, 1000000);
		const posY_1 = new NumberSchema("lower_corner_y_position", 1, -1000000, 1000000);

		const posX_2 = new NumberSchema("upper_corner_x_position", 1, -1000000, 1000000);
		const posY_2 = new NumberSchema("upper_corner_y_position", 1, -1000000, 1000000);

		InGameActionList.DELETE_BUILDING.setOptions([posX, posY]);
		this.#actions.addAction(InGameActionList.DELETE_BUILDING);

		InGameActionList.DELETE_IN_AREA.setOptions([posX_1, posY_1, posX_2, posY_2]);
		this.#actions.addAction(InGameActionList.DELETE_IN_AREA);
	}

	#promptDescriptors() {
		this.#actions.addAction(InGameActionList.PATCHES_NEARBY);
	}
}