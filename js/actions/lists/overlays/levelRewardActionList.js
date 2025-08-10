import { SdkAction } from "../../../sdkActions/sdkAction";

export class LevelRewardActionList {
	static close = "close_level_reward_window";
	static actions = [
		new SdkAction(this.close,
			"Close the current window."
		),
	];
}