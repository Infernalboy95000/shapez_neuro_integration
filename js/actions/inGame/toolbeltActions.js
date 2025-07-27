import { BaseActions } from "../baseActions";
import { ToolbeltSelector } from "../executers/selectors/toolbeltSelector";
import { ToolbeltInfo } from "../executers/toolbelt/toolbeltInfo";
import { ToolsList } from "../lists/toolbeltActionList";

export class ToolbeltActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ToolbeltSelector} */ #toolbeltSelector;
	/** @type {ToolbeltInfo} */ #toolbeltInfo;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(ToolsList.actions);
		super.addCallables(new Map([
			[ToolsList.getStats, (e) => { return this.#tryGetBuildingStats(e)}],
		]));

		this.#root = root;
		this.#toolbeltSelector = new ToolbeltSelector(root);
		this.#toolbeltInfo = new ToolbeltInfo(root);
	};

	activate() {
		const options = ToolsList.getOptions(
			this.#toolbeltSelector.getAvailableBuildings()
		);
		super.setOptions(options);
		super.activate();
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryGetBuildingStats(params) {
		return this.#toolbeltInfo.buildingInfo(
			params[ToolsList.build]
		)
	}
}