import { SdkAction } from "../definitions/sdkAction";

export class MainMenuActionList {
	// This action is used when only one map is allowed, to simplify
	static PLAY_GAME = new SdkAction(
		"play_game", "Play the game"
	);

	static CONTINUE_GAME = new SdkAction(
		"continue_game", "Continue last played map"
	);

	static NEW_GAME = new SdkAction(
		"new_game", "Play in a new map"
	);

	static LOAD_GAME = new SdkAction(
		"load_game", "Select the map you want to load"
	);

	/*
	- Go to settings ?
	- Close game ??
	*/
}