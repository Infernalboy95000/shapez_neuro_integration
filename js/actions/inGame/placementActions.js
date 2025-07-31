import { BaseActions } from "../baseActions";
import { BeltPlannerBuilder } from "../executers/builders/beltPlannerBuilder";
import { MassBuilder } from "../executers/builders/massBuilder";
import { SingleBuilder } from "../executers/builders/singleBuilder";
import { ToolbeltSelector } from "../executers/selectors/toolbeltSelector";
import { PlaceList } from "../lists/placementActionsList";

/** Manages all actions related to placement. */
export class PlacementActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ToolbeltSelector} */ #toolbelt;
	/** @type {SingleBuilder} */ #singleBuilder;
	/** @type {MassBuilder} */ #massBuilder;
	/** @type {BeltPlannerBuilder} */ #beltPlanner;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(PlaceList.actions);
		super.addCallables(new Map([
			[PlaceList.placeBuild, (e) => { return this.#tryPlaceBuilding(e)}],
			[PlaceList.placeBuildLine, (e) => { return this.#tryPlaceBuildingsLine(e)}],
			[PlaceList.beltPlanner, (e) => { return this.#tryBeltPlanner(e)}],
		]));

		this.#root = root;
		this.#toolbelt = new ToolbeltSelector(root);
		this.#singleBuilder = new SingleBuilder(root);
		this.#massBuilder = new MassBuilder(root, this.#singleBuilder);
		this.#beltPlanner = new BeltPlannerBuilder(root, this.#singleBuilder);
	};

	activate() {
		const buildings = this.#toolbelt.getTranslatedBuildings();
		const options = PlaceList.getOptions(
			this.#root, Array.from(buildings.keys())
		);
		super.setOptions(options);
		super.activate();
	}

	/**
	 * @param {string} buildName
	 * @returns {string}
	 * */
	#buildKey(buildName) {
		const buildings = this.#toolbelt.getTranslatedBuildings();
		return buildings.get(buildName);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryPlaceBuilding(params) {
		return this.#singleBuilder.tryPlaceBuilding(
			this.#buildKey(params[PlaceList.build]), params[PlaceList.rot],
			params[PlaceList.xPos], params[PlaceList.yPos],
		);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryPlaceBuildingsLine(params) {
		return this.#massBuilder.tryPlaceBuildingLine(
			this.#buildKey(params[PlaceList.build]), params[PlaceList.rot],
			params[PlaceList.xPos], params[PlaceList.yPos],
			params[PlaceList.dir], params[PlaceList.lineLength]
		);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryBeltPlanner(params) {
		return this.#beltPlanner.buildPlan(
			params[PlaceList.xPos1], params[PlaceList.yPos1],
			params[PlaceList.xPos2], params[PlaceList.yPos2],
			params[PlaceList.endHorizontal]
		);
	}
}