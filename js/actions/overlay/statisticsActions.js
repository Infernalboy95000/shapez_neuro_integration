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
			[StatisticsActionList.showAscendant, () => { return this.#showAscendant()}],
			[StatisticsActionList.showUnsorted, () => { return this.#showUnsorted()}],
			[StatisticsActionList.changeUnits, (e) => { return this.#tryChangeUnits(e)}],
			[StatisticsActionList.close, () => { return this.#closeMenu()}],
		]));

		this.#root = root;
		this.#statsPanel = new StatisticsPanelController(root);
	};

	activate() {
		const units = this.#statsPanel.getUnits();
		const options = StatisticsActionList.getOptions(units);
		super.setOptions(options);
		super.activate();
	}

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
	#showAscendant() {
		super.deactivate([StatisticsActionList.showAscendant]);
		super.activate([StatisticsActionList.showUnsorted]);
		return {
			valid: true,
			msg: this.#statsPanel.sort(true)
		};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#showUnsorted() {
		super.deactivate([StatisticsActionList.showUnsorted]);
		super.activate([StatisticsActionList.showAscendant]);
		return {
			valid: true,
			msg: this.#statsPanel.sort(false)
		};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#tryChangeUnits(params) {
		return this.#statsPanel.changeUnits(params[StatisticsActionList.unit]);
	}

	/** @returns {{valid:boolean, msg:string}} */
	#closeMenu() {
		this.#statsPanel.close();
		return {valid: true, msg: "Statistics menu closed."};
	}
}