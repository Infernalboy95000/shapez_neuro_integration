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
		this.#stats.setDataSource(data);
		switch (data) {
			case enumAnalyticsDataSource.produced:
				return this.#statsInfo.describeProduced();
			case enumAnalyticsDataSource.delivered:
				return this.#statsInfo.describeDelivered();
			case enumAnalyticsDataSource.stored:
				return this.#statsInfo.describeStored();
		}
	}

	/**
	 * @param {boolean} sorted
	 * @returns {string}
	 * */
	sort(sorted) {
		let msg = "Showing shapes ";
		if (sorted) {
			msg += "in ascending order:\r\n";
		}
		else {
			msg += "unsorted:\r\n";
		}

		this.#stats.setSorted(sorted);
		msg += this.show(this.#stats.dataSource);
		return msg;
	}

	/** @returns {boolean} */
	isSorted() {
		return this.#stats.sorted;
	}

	close() {
		this.#stats.close();
	}
}