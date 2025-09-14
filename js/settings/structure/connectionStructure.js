import { ModSettings } from "../../modSettings";
import { ConnectionSettings } from "../blocks/connectionSettings";
import { ButtonSetting } from "../inputs/buttonSetting";
import { TextSetting } from "../inputs/textSetting";
import { ToggleSetting } from "../inputs/toggleSetting";
import { SettingCategory } from "../settingsCategory";

export class ConnectionStructure {
	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {HTMLDivElement} menu
	 */
	static build(mod, menu) {
		new SettingCategory(menu, "Player connection", true);
		const connSettings = new ConnectionSettings(mod);

		connSettings.addSdkButton(new ButtonSetting(
			mod, menu,
			"SDK integration",
			"Connect the SDK integration to your player.",
			"Connect",
			ButtonSetting.Style.DEFAULT,
			"sdkStatus"
		));

		connSettings.addSdkURL(new TextSetting (
			mod, menu,
			"SDK URL",
			"The URL the SDK will use next time is connected.",
			"sdkURL",
			"text",
			ModSettings.get(ModSettings.KEYS.socketURL),
			256
		));

		connSettings.addHideURL(new ToggleSetting (
			mod, menu,
			"Hide URL",
			"Hides the connection URL everywhere, even on it's input field.",
			"sdkHideURL"
		));
	}
}