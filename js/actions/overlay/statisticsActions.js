import { BaseActions } from "../base/baseActions";
import { StatisticsActionList } from "../lists/overlays/statisticsActionList";

export class StatisticsActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	
	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(StatisticsActionList.actions);
		super.addCallables(new Map([
			[StatisticsActionList.close, () => { return this.#closeMenu()}],
		]));

		this.#root = root;
	};

	/** @returns {{valid:boolean, msg:string}} */
	#closeMenu() {
		// @ts-ignore
		this.#root.hud.parts.statistics.close();
		return {valid: true, msg: "Statistics menu closed"};
	}
}