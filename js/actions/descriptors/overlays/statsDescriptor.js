import { globalConfig } from "shapez/core/config";
import { formatBigNumber } from "shapez/core/utils";
import { HUDStatistics } from "shapez/game/hud/parts/statistics";
import { statisticsUnitsSeconds } from "shapez/game/hud/parts/statistics_handle";
import { enumAnalyticsDataSource } from "shapez/game/production_analytics";
import { T } from "shapez/translations";

export class StatsDescriptor {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {HUDStatistics} */ #stats;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		// @ts-ignore
		this.#stats = root.hud.parts.statistics;
	}

	describeProduced() {
		let result = this.#describe(
			Object.entries(
				this.#root.productionAnalytics.getCurrentShapeRatesRaw(
					enumAnalyticsDataSource.produced
				)
			), enumAnalyticsDataSource.produced
		);
		if (result == "") {
			result = "Your factory is not producing shapes at the moment.";
		}
		return result;
	}

	describeDelivered() {
		let result = this.#describe(
			Object.entries(
				this.#root.productionAnalytics.getCurrentShapeRatesRaw(
					enumAnalyticsDataSource.delivered
				)
			), enumAnalyticsDataSource.delivered
		);
		if (result == "") {
			result = "Your factory is not delivering shapes to the hub at the moment.";
		}
		return result;
	}

	describeStored() {
		let result = this.#describe(
			Object.entries(this.#root.hubGoals.storedShapes),
			enumAnalyticsDataSource.stored
		);
		if (result == "") {
			result = "You haven't stored shapes to the hub, yet.";
		}
		return result;
	}

	/**
	 * @param {[string, any][]} entries
	 * @param {enumAnalyticsDataSource} dataType
	 * @returns {string}
	 */
	#describe(entries, dataType) {
		let result = "";

		// @ts-ignore
		const pinnedShapes = this.#root.hud.parts.pinnedShapes;

		entries.sort((a, b) => {
			const aPinned = pinnedShapes.isShapePinned(a[0]);
			const bPinned = pinnedShapes.isShapePinned(b[0]);

			if (aPinned !== bPinned) {
				return aPinned ? -1 : 1;
			}

			// Sort by shape key for some consistency
			if (!this.#stats.sorted || b[1] == a[1]) {
				return b[0].localeCompare(a[0]);
			}
			return b[1] - a[1];
		});

		for (let i = 0; i < Math.min(entries.length, 200); ++i) {
			const entry = entries[i];
			const shapeKey = entry[0];

			if (dataType == enumAnalyticsDataSource.stored) {
				const stored = formatBigNumber(
						this.#root.hubGoals.storedShapes[shapeKey] || 0
					);
					result += `Stored ${stored} ${shapeKey}\r\n`;
			}
			else {
				const definition = this.#root.shapeDefinitionMgr.getShapeFromShortKey(shapeKey);
				const rate = this.#root.productionAnalytics.getCurrentShapeRateRaw(
					dataType, definition) /
					//@ts-ignore
					globalConfig.analyticsSliceDurationSeconds;
				const rateFormatted = T.ingame.statistics.shapesDisplayUnits[this.#stats.currentUnit].replace(
					"<shapes>",
					formatBigNumber(rate * statisticsUnitsSeconds[this.#stats.currentUnit])
				);

				if (dataType == enumAnalyticsDataSource.produced) {
					result += `Producing ${shapeKey} at ${rateFormatted}\r\n`;
				}
				else {
					result += `Delivering ${shapeKey} at ${rateFormatted}\r\n`;
				}
			}
		}

		return result;
	}
}