import { gMetaBuildingRegistry } from "shapez/core/global_registries";
import { MetaBuilding } from "shapez/game/meta_building";

export class InGameBuilder {
	/** @type {import("shapez/game/root").GameRoot} */ #root

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/** @returns {Array<MetaBuilding>} */
	getToolbelt() {
		const buildings = this.#root.hud.parts.buildingsToolbar.primaryBuildings;
		const metaBuilds = [];

		for (let i = 0; i < buildings.length; i++) {
			/** @type {MetaBuilding} */
			const meta = gMetaBuildingRegistry.findByClass(buildings[i]);
			if (meta.getIsUnlocked(this.#root)) {
				metaBuilds.push(meta);
			}
		}

		return metaBuilds;
	}

	/**
	 * @param {string} buildingName
	 * @returns {("SELECTED"|"DESELECTED"|"LOCKED")}
	 * */
	selectBuilding(buildingName) {
		const building = this.#getBuildingByName(buildingName);
		this.#root.hud.parts.buildingsToolbar
			.selectBuildingForPlacement(building);
		
		const buildingHandle = this.#root.hud.parts.buildingsToolbar.
			buildingHandles[building.getId()];
		if (!buildingHandle.unlocked) {
			return "LOCKED";
		}
		else if (buildingHandle.selected) {
			return "SELECTED";
		}
		else {
			return "DESELECTED";
		}
	}

	deselectCurrentBulding() {
		this.#root.hud.signals.buildingSelectedForPlacement.dispatch(null);
		this.#root.hud.parts.buildingsToolbar.onSelectedPlacementBuildingChanged(null);
	}

	/**
	 * @param {string} buildingName
	 * @returns {(MetaBuilding)}
	 */
	#getBuildingByName(buildingName) {
		const buildings = this.getToolbelt();

		for (let i = 0; i < buildings.length; i++)  {
			if (buildings[i].getId() == buildingName) {
				return buildings[i];
			}
		}
		return buildings[0];
	}
}