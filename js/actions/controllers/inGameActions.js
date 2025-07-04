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
import { Rectangle } from "shapez/core/rectangle";
import { GameCore } from "shapez/game/core";

export class InGameActions {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ActionList} */ #actions;
	/** @type {InGameBuilder} */ #builder;
	/** @type {InGameMassSelector} */ #massSelector;
	/** @type {MapDescriptor} */ #mapDescriptor;
	/** @type {boolean} */ #moving;
	/** @type {boolean} */ static #initialized = false;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;
		this.#actions = new ActionList();
		this.#mapDescriptor = new MapDescriptor(mod, root);

		if (!InGameActions.#initialized) {
			this.#initialize();
		}
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

	#initialize() {
		const ourClass = this;

		this.#mod.modInterface.runAfterMethod(
			GameCore,
			"tick",
			function(deltaMs) {
				ourClass.#checkCameraMovement();
				return true;
			}
		);
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
				this.#tryScanPatches(action);
				return true;
			case InGameActionList.DESCRIBE_PATCH.getName():
				this.#tryDescribePatch(action);
				return true;
			case InGameActionList.DESCRIBE_BUILDINGS.getName():
				this.#tryDescribeBuildings(action);
				return true;
			case InGameActionList.MOVE_CAMERA.getName():
				this.#moveCameraAction(action);
				return true;
			case InGameActionList.CHANGE_ZOOM.getName():
				this.#zoomCameraAction(action);
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

	#tryScanPatches(action) {
		const msg = this.#mapDescriptor.scanNearbyPatches();
		SdkClient.tellActionResult(action.id, true, msg);
	}

	#tryDescribePatch(action) {
		const pos = new Vector(action.params.x_position, action.params.y_position);
		const msg = this.#mapDescriptor.fullyDescribePatch(pos);
		if (msg.includes("Sorry")) {
			SdkClient.tellActionResult(action.id, false, msg);
		}
		else {
			SdkClient.tellActionResult(action.id, true, msg);
		}
	}

	#tryDescribeBuildings(action) {
		const msg = this.#mapDescriptor.scanBuilding();
		SdkClient.tellActionResult(action.id, true, msg);
	}

	#moveCameraAction(action) {
		const vector = new Vector(action.params.x_position, action.params.y_position);
		this.#root.camera.setDesiredCenter(vector);
		SdkClient.tellActionResult(action.id, true, `Moving camera to x: ${vector.x}, y: ${vector.y}.`);
	}

	#zoomCameraAction(action) {
		const zoom = action.params.zoom_percent * 0.01;
		if (zoom == this.#root.camera.zoomLevel) {
			SdkClient.tellActionResult(action.id, true, `Zoom is already at ${action.params.zoom_percent}%.`);
		}
		else {
			this.#root.camera.setDesiredZoom(zoom);
			SdkClient.tellActionResult(action.id, true, `Adjusting zoom to ${action.params.zoom_percent}%.`);
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
		this.#promptDeleters();
		this.#promptDescriptors();
		this.#promptPositioners();
	}

	#promptPlacers() {
		const limits = this.#getVisibleLimits();
		const buildingNames = this.#builder.getBuildingNames();
		const buildings = new EnumSchema("building", buildingNames);

		const posX = new NumberSchema("x_position", 1, limits.x, limits.x + limits.w - 1);
		const posY = new NumberSchema("y_position", 1, limits.y, limits.y + limits.h - 1);

		const rotNames = ["UP", "DOWN", "LEFT", "RIGHT"];
		const rotations = new EnumSchema("rotation", rotNames);

		const direction = new EnumSchema("direction", rotNames);
		const lineLength = new NumberSchema("line_length", 1, 2, limits.w);

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
		const limits = this.#getVisibleLimits();
		const posX = new NumberSchema("x_position", 1, limits.x, limits.x + limits.w - 1);
		const posY = new NumberSchema("y_position", 1, limits.y, limits.y + limits.h - 1);

		const posX_1 = new NumberSchema("lower_corner_x_position", 1, limits.x, limits.x + limits.w - 1);
		const posY_1 = new NumberSchema("lower_corner_y_position", 1, -1000000, 1000000);

		const posX_2 = new NumberSchema("upper_corner_x_position", 1, limits.x, limits.x + limits.w - 1);
		const posY_2 = new NumberSchema("upper_corner_y_position", 1, limits.y, limits.y + limits.h - 1);

		InGameActionList.DELETE_BUILDING.setOptions([posX, posY]);
		this.#actions.addAction(InGameActionList.DELETE_BUILDING);

		InGameActionList.DELETE_IN_AREA.setOptions([posX_1, posY_1, posX_2, posY_2]);
		this.#actions.addAction(InGameActionList.DELETE_IN_AREA);
	}

	#promptDescriptors() {
		this.#actions.addAction(InGameActionList.PATCHES_NEARBY);

		const limits = this.#getVisibleLimits();
		const posX = new NumberSchema("x_position", 1, limits.x, limits.x + limits.w - 1);
		const posY = new NumberSchema("y_position", 1, limits.y, limits.y + limits.h - 1);

		InGameActionList.DESCRIBE_PATCH.setOptions([posX, posY]);
		this.#actions.addAction(InGameActionList.DESCRIBE_PATCH);

		this.#actions.addAction(InGameActionList.DESCRIBE_BUILDINGS);
	}

	#promptPositioners() {
		const tileRect = this.#getVisibleLimits().allScaled(2);

		const limitX = new NumberSchema("x_position", 1, tileRect.x, tileRect.x + tileRect.w - 1);
		const limitY = new NumberSchema("y_position", 1, tileRect.y, tileRect.y + tileRect.h - 1);

		InGameActionList.MOVE_CAMERA.setOptions([limitX, limitY]);
		this.#actions.addAction(InGameActionList.MOVE_CAMERA);

		const minZoom = Math.round(this.#root.camera.getMinimumZoom() * 100);
		const maxZoom = Math.round(this.#root.camera.getMaximumZoom() * 100);
		const zoomIn = new NumberSchema("zoom_percent", 1, minZoom, maxZoom);

		InGameActionList.CHANGE_ZOOM.setOptions([zoomIn]);
		this.#actions.addAction(InGameActionList.CHANGE_ZOOM);
	}

	/** @returns {Rectangle} */
	#getVisibleLimits() {
		const visibleRect = this.#root.camera.getVisibleRect();
		const tileRect = visibleRect.toTileCullRectangle();
		return tileRect;
	}

	#checkCameraMovement() {
		if (!this.#root.camera) {
			return;
		}

		if (this.#moving) {
			if (
				!this.#root.camera.viewportWillChange()
			) {
				this.#moving = false;
				this.#promptActions();
			}
		}
		else {
			if (
				this.#root.camera.viewportWillChange()
			) {
				this.#moving = true;
				this.#actions.removeAllActions();
			}
		}
	}
}