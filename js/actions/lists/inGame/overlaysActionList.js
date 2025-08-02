import { SdkAction } from "../../../sdkActions/sdkAction";

export class OverlaysActionList {
	static openUpgrades = "open_upgrades";
	static openStats = "open_statistics";
	static saveGame = "save_game";
	static pauseGame = "pause_game";
	
	static actions = [
		new SdkAction(
			this.openUpgrades, "Open the upgrades menu."
		),
		new SdkAction(
			this.openStats, "Open the statistics menu."
		),
		new SdkAction(
			this.saveGame, "Manually save the game."
		),
		new SdkAction(
			this.pauseGame, "Pause the game."
		)
	];
}