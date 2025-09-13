import { ModSettings } from "../../modSettings";
import { StartupSettings } from "../blocks/startupSettings";
import { NumberSetting } from "../inputs/numberSetting";
import { OptionListSetting } from "../inputs/optionListSetting";
import { ToggleSetting } from "../inputs/toggleSetting";
import { SettingCategory } from "../settingsCategory";

export class ContextStructure {
	static ANY_MAP = "any_map";
	static ANY_OPTION = "any_option";
	static NEW_MAP = "new_map";
	static LAST_MAP = "last_map";

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {HTMLDivElement} menu
	 */
	static build(mod, menu) {
		new SettingCategory(menu, "Startup");
		const startupSettngs = new StartupSettings();

		startupSettngs.addAutoConnectToogle(new ToggleSetting (
			mod, menu,
			"Auto connect to player",
			"Attempts to connect to the player when launching the game",
			"sdkPlayerAutoConnect"
		));

		startupSettngs.addPlayerChooseMapToggle(new ToggleSetting (
			mod, menu,
			"Player can choose map",
			"Allows the player to start a map. This can be limited to certain maps.",
			"sdkPlayerChooseMap"
		));

		startupSettngs.addForceOpenMapToggle(new ToggleSetting (
			mod, menu,
			"Force open map",
			"Opens a map when entering the main menu. This can be limited to certain maps.",
			"sdkForceOpenMap"
		));

		startupSettngs.addForceMapTimer(new NumberSetting (
			mod, menu,
			"Force map delay",
			"Delays opening a map by force for a set ammount of seconds.",
			ModSettings.get(ModSettings.KEYS.forcedMapTime), 0, 10, 0.1, 's',
			"sdkForcedMapTimer"
		));

		const mapOptions = this.#getMapOptions(mod);
		
		startupSettngs.addMapAvailableOptions(new OptionListSetting(
			mod, menu,
			"Map to open",
			"Which map will be allowed to be open by the player or forced to open. " +
			"After selecting and creating a new map, this will set to continue it after",
			mapOptions, ModSettings.get(ModSettings.KEYS.mapAvailable), "any_map",
			"sdkMapAvailable",
		));
	}

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @return {Map} */
	static #getMapOptions(mod) {
		const mapOptions = new Map();
		mapOptions.set(this.ANY_MAP, "Any map");
		mapOptions.set(this.ANY_OPTION, "Any option");
		mapOptions.set(this.NEW_MAP, "New Map");
		mapOptions.set(this.LAST_MAP, "Continue");
		const saves = mod.app.savegameMgr.getSavegamesMetaData();
		let unnamedMaps = 0;

		for (let i = 0; i < saves.length; i++) {
			let mapName = saves[i].name;

			if (!mapName) {
				unnamedMaps++;
				mapName = `Unnamed map ${unnamedMaps}`;
			}
			mapOptions.set(saves[i].internalId, mapName);
		}

		return mapOptions;
	}
}