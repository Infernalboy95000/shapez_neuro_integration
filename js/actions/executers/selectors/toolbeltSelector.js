import { gMetaBuildingRegistry } from "shapez/core/global_registries";
import { MetaBuilding } from "shapez/game/meta_building";
import { RotationCodes } from "../../descriptors/shapes/rotationCodes";
import { T } from "shapez/translations";
import { HUDBaseToolbar } from "shapez/game/hud/parts/base_toolbar";

/** Helps manage the current toolbelt */
export class ToolbeltSelector {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/**
	 * @param {string} buildingID
	 * @param {string} variant
	 * @returns {{valid:boolean, msg:string}}
	 * */
	trySelectBuilding(buildingID, variant) {
		if (!this.#doesBuildingExist(buildingID, variant)) {
			return {valid:false, msg: `The building does not exist`};
		}

		const building = this.getBuildingByID(buildingID);
		if (!this.#isUnlocked(building)) {
			return {valid:false, msg:`the building is not unlocked`};
		}

		this.#selectBuilding(building, variant);
		return {valid:true, msg:""};
	}

	/**
	 * @param {string} buildingID
	 * @param {string} variant
	 * @param {string} rotKey
	 * @returns {{valid:boolean, msg:string}}
	 * */
	trySelectAndRotate(buildingID, variant, rotKey) {
		const result = this.trySelectBuilding(buildingID, variant);
		if (!result.valid) {
			return result;
		}

		if (!RotationCodes.isRotationValid(rotKey)) {
			return {valid:false, msg:`Rotation ${rotKey} is invalid`};
		}

		this.#rotateBuilding(RotationCodes.getAngle(rotKey));
		return {valid:true, msg:""};
	}

	/** @returns {Map<string, {id:string, variant:string}>} */
	getTranslatedBuildings() {
		const translations = new Map();
		const buildings = this.#getAvailableBuildings();
		for (let i = 0; i < buildings.length; i++) {
			const fullName = T.buildings[buildings[i].id][buildings[i].variant].name;
			translations.set(fullName, buildings[i]);
		}

		return translations;
	}

	/** @returns {Array<{id:string, variant:string}>} */
	#getAvailableBuildings() {
		/** @type {Array<{id:string, variant:string}>} */
		const buildingNames = [];
		const buildings = this.#getToolbelt();
		for (let i = 0; i < buildings.length; i++) {
			if (this.#isUnlocked(buildings[i])) {
				const variants = buildings[i].getAvailableVariants(this.#root);
				for (let j = 0; j < variants.length; j++) {
					buildingNames.push({
						id:buildings[i].getId(),
						variant:variants[j]
					});
				}
			}
		}
		return buildingNames;
	}

	/**
	 * @param {string} buildingID
	 * @returns {MetaBuilding}
	 */
	getBuildingByID(buildingID) {
		const buildings = this.#getToolbelt();

		for (let i = 0; i < buildings.length; i++)  {
			if (buildings[i].getId() == buildingID) {
				return buildings[i];
			}
		}
		return buildings[0];
	}

	/**
	 * @param {MetaBuilding} building
	 * @param {string} variant
	 * */
	#selectBuilding(building, variant) {
		const toolbar = this.#getToolbar();
		const handle = toolbar.buildingHandles[building.getId()];

		if (!handle.selected) {
			toolbar.selectBuildingForPlacement(building);
		}

		this.#root.hud.parts.buildingPlacer.setVariant(variant);
	}

	/** @param {number} rotation */
	#rotateBuilding(rotation) {
		this.#root.hud.parts.buildingPlacer.currentBaseRotation = rotation;
	}

	/**
	 * @param {string} buildingName
	 * @param {string} variant
	 * @returns {boolean}
	 * */
	#doesBuildingExist(buildingName, variant) {
		const buildings = this.#getAvailableBuildings();
		for (let i = 0; i < buildings.length; i++) {
			if (buildings[i].id == buildingName &&
				buildings[i].variant == variant) {
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
		const buildings = this.#getToolbar().allBuildings;
		const metaBuilds = [];

		for (let i = 0; i < buildings.length; i++) {
			/** @type {MetaBuilding} */
			const meta = gMetaBuildingRegistry.findByClass(buildings[i]);
			metaBuilds.push(meta);
		}

		return metaBuilds;
	}

	/** @returns {HUDBaseToolbar} */
	#getToolbar() {
		if (this.#root.currentLayer == "regular") {
			return this.#root.hud.parts.buildingsToolbar;
		}
		else {
			// @ts-ignore
			return this.#root.hud.parts.wiresToolbar;
		}
	}
}