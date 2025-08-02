import { SdkAction } from "../../../sdkActions/sdkAction";

export class PinList {
	static goal = "show_current_goal";
	static pinned = "list_pinned_shapes";
	static actions = [
		new SdkAction(PinList.goal,
			"Describe what's the current shape you have to deliver to the HUB in order to get to the next level."
		),
		new SdkAction(PinList.pinned,
			"Get the list of shapes you have pinned. Those are related to upgrade goals."
		)
	];
}