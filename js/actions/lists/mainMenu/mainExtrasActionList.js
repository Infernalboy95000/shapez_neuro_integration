import { SdkAction } from "../../../sdkActions/sdkAction";

export class MainExtrasActionList {
	static closeGame = "close_game";
	static actions = [
		new SdkAction(this.closeGame,
			"Close the entire game."
		),
	];
}