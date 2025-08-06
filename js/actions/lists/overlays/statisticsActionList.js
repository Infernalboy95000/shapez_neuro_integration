import { SdkAction } from "../../../sdkActions/sdkAction";

export class StatisticsActionList {
	static stats = "get_current_stats_info";
	static showProduced = "show_produced_shapes";
	static showDelivered = "show_delivered_shapes";
	static showStored = "show_stored_shapes";
	static gridMode = "show_in_grid_mode";
	static listMode = "show_in_list_mode";
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
		new SdkAction(this.close,
			"Close the statistics menu."
		)
	];
}