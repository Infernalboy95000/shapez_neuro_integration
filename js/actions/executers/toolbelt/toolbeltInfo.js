import { BuildingDescriptor } from "../../descriptors/buildings/buildingDescriptor";
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
	 * @param {string} buildingName
	 * @returns {{valid:boolean, msg:string}}
	 * */
	buildingInfo(buildingName) {
		const result = this.#selector.trySelectBuilding(buildingName);
		if (!result.valid) {
			return result;
		}

		const building = this.#selector.getBuildingByName(buildingName);
		const msg = BuildingDescriptor.getInfoAndStats(this.#root, building);
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