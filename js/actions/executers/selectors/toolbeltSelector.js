import { gMetaBuildingRegistry } from "shapez/core/global_registries";
import { MetaBuilding } from "shapez/game/meta_building";
import { RotationCodes } from "../../helpers/rotationCodes";

/** Helps manage the current toolbelt */
export class ToolbeltSelector {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/**
	 * @param {string} buildingName
	 * @param {string} rotKey
	 * @returns {{valid:boolean, msg:string}}
	 * */
	trySelectAndRotate(buildingName, rotKey) {
		if (!this.#doesBuildingExist(buildingName)) {
			return {valid:false, msg: `Building ${buildingName} does not exist`};
		}

		const building = this.getBuildingByName(buildingName);
		if (!this.#hasBuildingUnlocked(building)) {
			return {valid:false, msg:`Building ${buildingName} not unlocked`};
		}

		if (!RotationCodes.isRotationValid(rotKey)) {
			return {valid:false, msg:`Rotation ${rotKey} is invalid`};
		}

		this.#selectBuilding(building);
		this.#rotateBuilding(RotationCodes.getAngle(rotKey));
		return {valid:true, msg:""};
	}

	/** @returns {Array<String>} */
	getAvailableBuildings() {
		const buildingNames = [];
		const buildings = this.#getUnlockedToolbelt();
		for (let i = 0; i < buildings.length; i++) {
			buildingNames.push(buildings[i].getId());
		}
		return buildingNames;
	}

	/**
	 * @param {string} buildingName
	 * @returns {(MetaBuilding)}
	 */
	getBuildingByName(buildingName) {
		const buildings = this.#getUnlockedToolbelt();

		for (let i = 0; i < buildings.length; i++)  {
			if (buildings[i].getId() == buildingName) {
				return buildings[i];
			}
		}
		return buildings[0];
	}

	/** @param {MetaBuilding} building */
	#selectBuilding(building) {
		const handle = this.#root.hud.parts.buildingsToolbar.
			buildingHandles[building.getId()];

		if (!handle.selected) {
			this.#root.hud.parts.buildingsToolbar
				.selectBuildingForPlacement(building);
		}
	}

	/** @param {number} rotation */
	#rotateBuilding(rotation) {
		this.#root.hud.parts.buildingPlacer.currentBaseRotation = rotation;
	}

	/**
	 * @param {string} buildingName
	 * @returns {boolean}
	 * */
	#doesBuildingExist(buildingName) {
		const buildings = this.getAvailableBuildings();
		return buildings.includes(buildingName);
	}

	/**
	 * @param {MetaBuilding} building
	 * @returns {boolean}
	 * */
	#hasBuildingUnlocked(building) {
		const handle = this.#root.hud.parts.buildingsToolbar.
			buildingHandles[building.getId()];
		
		return handle.unlocked;
	}

	/** @returns {Array<MetaBuilding>} */
	#getUnlockedToolbelt() {
		const buildings = this.#root.hud.parts.buildingsToolbar.allBuildings;
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
}