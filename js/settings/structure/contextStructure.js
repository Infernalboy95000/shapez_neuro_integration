import { ModSettings } from "../../modSettings";
import { ContextSettings } from "../blocks/contextSettings";
import { NumberSetting } from "../inputs/numberSetting";
import { ToggleSetting } from "../inputs/toggleSetting";
import { SettingCategory } from "../settingsCategory";

export class ContextStructure {
	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {HTMLDivElement} menu
	 */
	static build(mod, menu) {
		new SettingCategory(menu, "SDK Context");
		const contextSettings = new ContextSettings();

		contextSettings.addCorodsGridToogle(new ToggleSetting (
			mod, menu,
			"Coordinates grid",
			"Shows every tile's x/y position. Maybe usefull when using external vision.",
			"sdkCoordsGrid"
		));

		contextSettings.addDescriptiveActionsToogle(new ToggleSetting (
			mod, menu,
			"Descriptive actions",
			"Allows the player to use descriptive actions like 'scan buildings' to have some sense on what's going on. Maybe you want to disable them if the player is using external vision.",
			"sdkDescriptiveActions"
		));

		contextSettings.addWaitAfterHumanNumber(new NumberSetting (
			mod, menu,
			"Wait after human move",
			"The SDK will disallow the player to do movement actions if a human moves around the map. Set how many seconds will take to give back control to the player.",
			ModSettings.get(ModSettings.KEYS.waitAfterHumanTime),
			1, 10, 0.5, 's', "sdkWaitAfterHumanTime"
		));
	}
}