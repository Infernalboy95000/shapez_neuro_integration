import { SdkAction } from "../../../sdkActions/sdkAction";

export class ShapeInfoActionList {
	static layersInfo = "get_shape_info";
	static close = "close_shape_info_menu";
	static actions = [
		new SdkAction(this.layersInfo,
			"Get the full composition of one or all layers of the shape on screen."
		),
		new SdkAction(this.close,
			"Close the shape info menu."
		)
	];
}