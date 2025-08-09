import { HUDStatistics } from "shapez/game/hud/parts/statistics";
import { enumAnalyticsDataSource } from "shapez/game/production_analytics";
import { StatsDescriptor } from "../../descriptors/overlays/statsDescriptor";

export class StatisticsPanelController {
	/** @type {HUDStatistics} */ #stats;
	/** @type {StatsDescriptor} */ #statsInfo;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		// @ts-ignore
		this.#stats = root.hud.parts.statistics;
		this.#statsInfo = new StatsDescriptor(root);
	}

	/**
	 * @param {enumAnalyticsDataSource} data
	 * @returns {string}
	 * */
	show(data) {
		let msg = this.#getSortMessage();
		this.#stats.setDataSource(data);
		switch (data) {
			case enumAnalyticsDataSource.produced:
				msg += this.#statsInfo.describeProduced();
				break;
			case enumAnalyticsDataSource.delivered:
				msg += this.#statsInfo.describeDelivered();
				break;
			case enumAnalyticsDataSource.stored:
				msg += this.#statsInfo.describeStored();
				break;
		}
		return msg;
	}

	/**
	 * @param {boolean} sorted
	 * @returns {string}
	 * */
	sort(sorted) {
		this.#stats.setSorted(sorted);
		let msg = this.#getSortMessage();
		msg += this.show(this.#stats.dataSource);
		return msg;
	}

	/** @returns {boolean} */
	isSorted() {
		return this.#stats.sorted;
	}

	/** @returns {Array<string>} */
	getUnits() {
		return this.#statsInfo.describeUnits();
	}

	/**
	 * @param {string} unit
	 * @returns {{valid:boolean, msg:string}} */
	changeUnits(unit) {
		const result = {valid:false, msg:"Invalid unit"};
		const units = this.getUnits();
		for (let i = 0; i < units.length && !result.valid; i++) {
			if (units[i] == unit) {
				this.#stats.currentUnit = unit;
				this.#stats.rerenderPartial();
				result.valid = true;
				result.msg = this.show(this.#stats.dataSource);
			}
		}
		return result;
	}

	/** @returns {string} */
	#getSortMessage() {
		let msg = "Showing shapes ";
		if (this.#stats.sorted) {
			msg += "in ascending order:\r\n";
		}
		else {
			msg += "unsorted:\r\n";
		}
		return msg;
	}

	close() {
		this.#stats.close();
	}
}