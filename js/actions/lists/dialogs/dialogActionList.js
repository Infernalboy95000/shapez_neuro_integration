import { SdkAction } from "../../../sdkActions/sdkAction";

export class DialogActionList {
	static read = "read_notification"
	static close = "close_notification";
	static accept = "accept_notification"
	static chooseOption = "choose_option";
	static actions = [
		new SdkAction(DialogActionList.read,
			"Read the current dialog text."
		),
		new SdkAction(DialogActionList.accept,
			"Accept and close the current notification."
		),
	];
}