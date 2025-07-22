import { SdkAction } from "../../sdkActions/sdkAction";
import { SdkClient } from "../../sdkClient";
import { BaseAction } from "../baseAction";

/** Manages all actions related to placement. */
export class PlacementActions extends BaseAction {
	#actions = {
		place_building: {
			action: new SdkAction(
				"place_building",
				"Select and place a building from your toolbelt."
			),
			function: this.#tryPlaceBuilding
		},
		place_line_of_buildings: {
			action: new SdkAction(
				"place_line_of_buildings",
				"Place an entire straight line of buildings at once."
			),
			function: this.#tryPlaceBuildingsLine
		},
		use_belt_planner: {
			action: new SdkAction(
				"use_belt_planner",
				"Place belts in a path from one point to the other."
			),
			function: this.#tryBeltPlanner
		}
	}

	/**
	 * @param {{id:string,name:string,params:{}}} data
	 * @returns {boolean}
	 */
	tryAction(data) {
		if (this.#actions[data.name]) {
			const response = this.#actions[data.name].checkResponse(data);
			if (response.valid) {
				this.#actions[data.name].function(data.id, data.params);
			}
			else {
				SdkClient.tellActionResult(data.id, false, response.error)
			}
			return true;
		}
		else {
			return false;
		}
	}

	/** @param {number} id @param {{}} params */
	#tryPlaceBuilding(id, params) {

	}

	/** @param {number} id @param {{}} params */
	#tryPlaceBuildingsLine(id, params) {

	}

	/** @param {number} id @param {{}} params */
	#tryBeltPlanner(id, params) {

	}
}