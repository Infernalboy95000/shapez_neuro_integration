import { BaseActions } from "../base/baseActions";
import { StatisticsActionList } from "../lists/overlays/statisticsActionList";
import { enumAnalyticsDataSource } from "shapez/game/production_analytics";
import { StatisticsPanelController } from "../executers/overlays/statisticsPanelController";

export class StatisticsActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {StatisticsPanelController} */ #statsPanel;
	
	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(StatisticsActionList.actions);
		super.addCallables(new Map([
			[StatisticsActionList.showProduced, () => { return this.#showProduced()}],
			[StatisticsActionList.showDelivered, () => { return this.#showDelivered()}],
			[StatisticsActionList.showStored, () => { return this.#showStored()}],
			[StatisticsActionList.close, () => { return this.#closeMenu()}],
		]));

		this.#root = root;
		this.#statsPanel = new StatisticsPanelController(root);
	};

	/** @returns {{valid:boolean, msg:string}} */
	#showProduced() {
		return {
			valid: true,
			msg: this.#statsPanel.show(enumAnalyticsDataSource.produced)
		};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#showDelivered() {
		return {
			valid: true,
			msg: this.#statsPanel.show(enumAnalyticsDataSource.delivered)
		};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#showStored() {
		return {
			valid: true,
			msg: this.#statsPanel.show(enumAnalyticsDataSource.stored)
		};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#closeMenu() {
		this.#statsPanel.close();
		return {valid: true, msg: "Statistics menu closed."};
	}
}