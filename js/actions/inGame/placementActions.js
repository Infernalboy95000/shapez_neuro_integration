import { BaseActions } from "../base/baseActions";
import { BeltPlannerBuilder } from "../executers/builders/beltPlannerBuilder";
import { MassBuilder } from "../executers/builders/massBuilder";
import { SingleBuilder } from "../executers/builders/singleBuilder";
import { ToolbeltSelector } from "../executers/selectors/toolbeltSelector";
import { PlacementActionList } from "../lists/inGame/placementActionsList";

/** Manages all actions related to placement. */
export class PlacementActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ToolbeltSelector} */ #toolbelt;
	/** @type {SingleBuilder} */ #singleBuilder;
	/** @type {MassBuilder} */ #massBuilder;
	/** @type {BeltPlannerBuilder} */ #beltPlanner;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(PlacementActionList.actions);
		super.addCallables(new Map([
			[PlacementActionList.placeBuild, (e) => { return this.#tryPlaceBuilding(e)}],
			[PlacementActionList.placeBuildLine, (e) => { return this.#tryPlaceBuildingsLine(e)}],
			[PlacementActionList.beltPlanner, (e) => { return this.#tryBeltPlanner(e)}],
		]));

		this.#root = root;
		this.#toolbelt = new ToolbeltSelector(root);
		this.#singleBuilder = new SingleBuilder(root);
		this.#massBuilder = new MassBuilder(root, this.#singleBuilder);
		this.#beltPlanner = new BeltPlannerBuilder(root, this.#singleBuilder);
	};

	activate() {
		const buildings = this.#toolbelt.getTranslatedBuildings();
		const options = PlacementActionList.getOptions(
			this.#root, Array.from(buildings.keys())
		);
		super.setOptions(options);
		super.activate();
	}

	/**
	 * @param {string} buildName
	 * @returns {{id:string, variant:string}}
	 * */
	#getBuilding(buildName) {
		const buildings = this.#toolbelt.getTranslatedBuildings();
		return buildings.get(buildName);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryPlaceBuilding(params) {
		const building = this.#getBuilding(params[PlacementActionList.build]);
		return this.#singleBuilder.tryPlaceBuilding(
			building.id, building.variant, params[PlacementActionList.rot],
			params[PlacementActionList.xPos], params[PlacementActionList.yPos],
		);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryPlaceBuildingsLine(params) {
		const building = this.#getBuilding(params[PlacementActionList.build]);
		return this.#massBuilder.tryPlaceBuildingLine(
			building.id, building.variant, params[PlacementActionList.rot],
			params[PlacementActionList.xPos], params[PlacementActionList.yPos],
			params[PlacementActionList.dir], params[PlacementActionList.lineLength]
		);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryBeltPlanner(params) {
		return this.#beltPlanner.buildPlan(
			params[PlacementActionList.xPos1], params[PlacementActionList.yPos1],
			params[PlacementActionList.xPos2], params[PlacementActionList.yPos2],
			params[PlacementActionList.endHorizontal]
		);
	}
}