import { SdkAction } from "../../../sdkActions/sdkAction";

export class PauseMenuActionList {
	static info = "save_info";
	static resume = "resume_game";
	static exit = "exit_to_main_menu";
	static actions = [
		new SdkAction(this.info,
			"Describe some general stats from your save file."
		),
		new SdkAction(this.resume,
			"Resume the game and close the pause menu."
		),
		new SdkAction(this.exit,
			"Save and exit to the main menu."
		)
	];
}