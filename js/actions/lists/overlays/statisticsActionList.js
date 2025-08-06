import { SdkAction } from "../../../sdkActions/sdkAction";

export class StatisticsActionList {
	static layersInfo = "get_shape_info";
	static close = "close_statistics_menu";
	static actions = [
		new SdkAction(this.close,
			"Close the statistics menu"
		)
	];
}