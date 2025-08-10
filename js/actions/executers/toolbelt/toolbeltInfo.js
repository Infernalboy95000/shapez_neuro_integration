import { BuildingStats } from "../../descriptors/buildings/buildingStats";
import { ToolbeltSelector } from "../selectors/toolbeltSelector";

export class ToolbeltInfo {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ToolbeltSelector} */ #selector;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		this.#selector = new ToolbeltSelector(root);
	}

	/**
	 * @param {string} buildingID
	 * @param {string} variant
	 * @returns {{valid:boolean, msg:string}}
	 * */
	buildingInfo(buildingID, variant) {
		const result = this.#selector.trySelectBuilding(buildingID, variant);
		if (!result.valid) {
			return result;
		}

		const building = this.#selector.getBuildingByID(buildingID);
		const msg = BuildingStats.describe(this.#root, building, variant);
		if (msg == "") {
			result.valid = false;
			result.msg = "Building has no stats.";
		}
		else {
			result.msg = msg;
		}

		return result;
	}
}