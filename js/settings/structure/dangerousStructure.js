import { DangerousSettings } from "../blocks/dangerousSettings";
import { ToggleSetting } from "../inputs/toggleSetting";
import { SettingCategory } from "../settingsCategory";

export class DangerousStructure {
	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {HTMLDivElement} menu
	 */
	static build(mod, menu) {
		new SettingCategory(menu, "Dangerous zone!");
		const contextSettings = new DangerousSettings();

		contextSettings.addAllowPauseToogle(new ToggleSetting (
			mod, menu,
			"Allow pause",
			"Allows the player to pause the current game.",
			"sdkAllowPause"
		));

		contextSettings.addAllowExitToogle(new ToggleSetting (
			mod, menu,
			"Allow exit to main menu",
			"Allows the player to exit to the main menu, while playing. Depends on pause permissions.",
			"sdkAllowExit"
		));

		contextSettings.addAllowCloseToogle(new ToggleSetting (
			mod, menu,
			"Allow close the game",
			"Allows the player to completly close the game while on main menu, without warnings!",
			"sdkAllowClose"
		));
	}
}