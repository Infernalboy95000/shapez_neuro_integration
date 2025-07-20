import { SdkAction } from "../definitions/sdkAction";

export class NotificationsActionList {
	static CLOSE_NOTIFICATION = new SdkAction(
		"close_notification", "Close the current notification."
	)
}