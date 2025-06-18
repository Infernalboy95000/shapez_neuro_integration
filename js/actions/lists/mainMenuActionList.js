import { EmptySdkAction } from "../definitions/emptySdkAction";
import { EnumSdkAction } from "../definitions/enumSdkAction";

export class MainMenuActionList {
	// This action is used when only one map is allowed, to simplify
	static PLAY_GAME = new EmptySdkAction(
		"play_game", "Play the game"
	);

	static CONTINUE_GAME = new EmptySdkAction(
		"continue_game", "Continue last played map"
	);

	static NEW_GAME = new EmptySdkAction(
		"new_game", "Play in a new map"
	);

	static LOAD_GAME = new EnumSdkAction(
		"load_game", "Select the map you want to load", "map"
	);

	/*
	- Go to settings ?
	- Close game ??
	*/
}