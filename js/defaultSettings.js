import { Mod } from "shapez/mods/mod";
//? I still don't get why the settings aren't set on the mod.json file

const SETTINGS = {
	socketURL: "localhost:8000",
	coordsGrid: false,
	autoConnect: false,
	hideURL: true,
	playerChooseMap: false,
	forceOpenMap: false,
	descriptiveActions: true,
	forcedMapTime: 5,
	mapAvailable : "any_map",
	waitAfterHumanTime: 5
}

export class DefaultSettings {
	/** @param {Mod} mod */
	static Set(mod) {
		for (let [key, value] of Object.entries(SETTINGS)) {
			if (mod.settings[key] == undefined)
				mod.settings[key] = value;
		}
		mod.saveSettings();
	}
}