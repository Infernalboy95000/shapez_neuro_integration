import { gMetaBuildingRegistry } from "shapez/core/global_registries";
import { MetaBuilding } from "shapez/game/meta_building";
import { RotationCodes } from "../../descriptors/shapes/rotationCodes";
import { T } from "shapez/translations";

/** Helps manage the current toolbelt */
export class ToolbeltSelector {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/**
	 * @param {string} buildingName
	 * @returns {{valid:boolean, msg:string}}
	 * */
	trySelectBuilding(buildingName) {
		if (!this.#doesBuildingExist(buildingName)) {
			return {valid:false, msg: `Building ${buildingName} does not exist`};
		}

		const building = this.getBuildingByName(buildingName);
		if (!this.#isUnlocked(building)) {
			return {valid:false, msg:`Building ${buildingName} is not unlocked`};
		}

		this.#selectBuilding(building);
		return {valid:true, msg:""};
	}

	/**
	 * @param {string} buildingName
	 * @param {string} rotKey
	 * @returns {{valid:boolean, msg:string}}
	 * */
	trySelectAndRotate(buildingName, rotKey) {
		const result = this.trySelectBuilding(buildingName);
		if (!result.valid) {
			return result;
		}

		if (!RotationCodes.isRotationValid(rotKey)) {
			return {valid:false, msg:`Rotation ${rotKey} is invalid`};
		}

		this.#rotateBuilding(RotationCodes.getAngle(rotKey));
		return {valid:true, msg:""};
	}

	/** @returns {Map<string, string>} */
	getTranslatedBuildings() {
		const translations = new Map();
		const names = this.getAvailableBuildings();
		for (let i = 0; i < names.length; i++) {
			//TODO: Add variants to this
			const buildName = T.buildings[names[i]].default.name;
			translations.set(buildName, names[i]);
		}

		return translations;
	}

	/** @returns {Array<String>} */
	getAvailableBuildings() {
		const buildingNames = [];
		const buildings = this.#getToolbelt();
		for (let i = 0; i < buildings.length; i++) {
			if (this.#isUnlocked(buildings[i])) {
				buildingNames.push(buildings[i].getId());
			}
		}
		return buildingNames;
	}

	/**
	 * @param {string} buildingName
	 * @returns {MetaBuilding}
	 */
	getBuildingByName(buildingName) {
		const buildings = this.#getToolbelt();

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
		const buildings = this.#getToolbelt();
		for (let i = 0; i < buildings.length; i++) {
			if (buildings[i].getId() == buildingName) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @param {MetaBuilding} building
	 * @returns {boolean}
	 * */
	#isUnlocked(building) {
		return building.getIsUnlocked(this.#root);
	}

	/** @returns {Array<MetaBuilding>} */
	#getToolbelt() {
		const buildings = this.#root.hud.parts.buildingsToolbar.allBuildings;
		const metaBuilds = [];

		for (let i = 0; i < buildings.length; i++) {
			/** @type {MetaBuilding} */
			const meta = gMetaBuildingRegistry.findByClass(buildings[i]);
			metaBuilds.push(meta);
		}

		return metaBuilds;
	}
}