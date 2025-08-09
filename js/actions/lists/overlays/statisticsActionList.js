import { EnumSchema } from "../../../sdkActions/schema/enumSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";

export class StatisticsActionList {
	static stats = "get_current_stats_info";
	static showProduced = "show_produced_shapes";
	static showDelivered = "show_delivered_shapes";
	static showStored = "show_stored_shapes";
	static showAscendant = "show_shapes_in_ascendant_order";
	static showUnsorted = "show_shapes_unsorted";
	static changeUnits = "change_stats_units";
	static close = "close_statistics_menu";
	static actions = [
		new SdkAction(this.showProduced,
			"Show all shapes produced within your factory, including intermediate products."
		),
		new SdkAction(this.showDelivered,
			"Show shapes which are being delivered to the Hub."
		),
		new SdkAction(this.showStored,
			"Show all shapes stored within the Hub."
		),
		new SdkAction(this.showAscendant,
			"Show current shape list in ascendant order."
		),
		new SdkAction(this.showUnsorted,
			"Show current shape list unsorted."
		),
		new SdkAction(this.changeUnits,
			"Change the current time scope shown in the stats."
		),
		new SdkAction(this.close,
			"Close the statistics menu."
		)
	];

	static unit = "unit";

	/**
	 * @param {Array<string>} units
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(units) {
		const options = {
			[this.unit]: new EnumSchema(this.unit, units),
		};
		return this.#mapOptions(options);
	}

	/**
	 * @param {Object} options
	 * @returns {Map<string, Array<SchemaBase>>}
	 */
	static #mapOptions(options) {
		return new Map([
			[
				this.changeUnits, [
					options[this.unit]
				]
			],
		]);
	}
}