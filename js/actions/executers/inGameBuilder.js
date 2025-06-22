import { gMetaBuildingRegistry } from "shapez/core/global_registries";
import { Vector } from "shapez/core/vector";
import { MetaBuilding } from "shapez/game/meta_building";

export class InGameBuilder {
	/** @type {Map<string, number>} */ #rotations = this.#getRotationsMap();
	/** @type {import("shapez/game/root").GameRoot} */ #root;

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
	 * @returns {boolean}
	 * */
	selectBuilding(buildingName) {
		const building = this.#getBuildingByName(buildingName);
		const handle = this.#root.hud.parts.buildingsToolbar.
			buildingHandles[building.getId()];
		
		if (!handle.unlocked) {
			return false;
		}

		if (!handle.selected) {
			this.#root.hud.parts.buildingsToolbar
				.selectBuildingForPlacement(building);
		}
		return true;
	}

	deselectCurrentBulding() {
		this.#root.hud.signals.buildingSelectedForPlacement.dispatch(null);
		this.#root.hud.parts.buildingsToolbar.onSelectedPlacementBuildingChanged(null);
	}

	/** @returns {boolean} */
	rotateBuilding(rotKey) {
		if (this.#rotations.has(rotKey)) {
			this.#root.hud.parts.buildingPlacer.currentBaseRotation = 
				this.#rotations.get(rotKey);
			return true;
		}
		return false;
	}

	/** @returns {string} */
	getCurrentRotation() {
		const rot = this.#root.hud.parts.buildingPlacer.currentBaseRotation;
		this.#rotations.forEach((value, key) => {
			if (value == rot) {
				return key;
			}
		});
		return "UP";
	}

	/**
	 * @param {number} posX
	 * @param {number} posY
	 * @returns {boolean} */
	placeBuilding(posX, posY) {
		const pos = new Vector(posX, posY);
		return this.#root.hud.parts.buildingPlacer.tryPlaceCurrentBuildingAt(pos);
	}

	/** @returns {Array<String>} */
	getBuildingNames() {
		const buildingNames = [];
		const buildings = this.getToolbelt();
		for (let i = 0; i < buildings.length; i++) {
			buildingNames.push(buildings[i].getId());
		}
		return buildingNames;
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

	/** @returns {Map<string, number>} */
	#getRotationsMap() {
		const map = new Map();
		map.set("UP", 0);
		map.set("RIGHT", 90);
		map.set("DOWN", 180);
		map.set("LEFT", 270);
		return map;
	}
}