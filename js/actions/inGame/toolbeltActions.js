import { HUDWiresOverlay } from "shapez/game/hud/parts/wires_overlay";
import { BaseActions } from "../base/baseActions";
import { ToolbeltSelector } from "../executers/selectors/toolbeltSelector";
import { ToolbeltInfo } from "../executers/toolbelt/toolbeltInfo";
import { ToolbeltActionList } from "../lists/inGame/toolbeltActionList";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";

export class ToolbeltActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ToolbeltSelector} */ #toolbeltSelector;
	/** @type {ToolbeltInfo} */ #toolbeltInfo;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(ToolbeltActionList.actions);
		super.addCallables(new Map([
			[ToolbeltActionList.getStats, (e) => { return this.#tryGetBuildingStats(e)}],
			[ToolbeltActionList.wiresLayer, () => { return this.#wiresLayer()}],
			[ToolbeltActionList.defaultLayer, () => { return this.#defaultLayer()}]
		]));

		this.#root = root;
		this.#toolbeltSelector = new ToolbeltSelector(root);
		this.#toolbeltInfo = new ToolbeltInfo(root);
	};

	activate() {
		const actions = [ToolbeltActionList.getStats];
		if (this.#root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_wires_painter_and_levers)) {
			if (this.#root.currentLayer == "wires") {
			actions.push(ToolbeltActionList.defaultLayer);
			}
			else {
				actions.push(ToolbeltActionList.wiresLayer);
			}
		}

		const buildings = this.#toolbeltSelector.getTranslatedBuildings();
		const options = ToolbeltActionList.getOptions(Array.from(buildings.keys()));
		super.setOptions(options);
		super.activate(actions);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryGetBuildingStats(params) {
		const buildings = this.#toolbeltSelector.getTranslatedBuildings();
		const building = buildings.get(params[ToolbeltActionList.build]);
		return this.#toolbeltInfo.buildingInfo(
			building.id, building.variant
		);
	}

	/** @returns {{valid:boolean, msg:string}} */
	#wiresLayer() {
		this.#switchLayers();
		return {valid: true, msg: "Switched to the wires layer."};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#defaultLayer() {
		this.#switchLayers();
		return {valid: true, msg: "Switched to the default layer."};
	}

	#switchLayers() {
		/** @type {HUDWiresOverlay} */ // @ts-ignore
		const layers = this.#root.hud.parts.wiresOverlay;
		layers.switchLayers();
	}
}