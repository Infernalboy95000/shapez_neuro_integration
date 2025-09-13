import { InfoBlock } from "../blocks/infoBlock";
import { SettingCategory } from "../settingsCategory";

export class InfoStructure {
	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {HTMLDivElement} menu
	 */
	static build(mod, menu) {
		new SettingCategory(menu, "Others");
		new InfoBlock(menu, "Mod data",
			`Running ${mod.metadata.name} on version: ${mod.metadata.version}<br>
			Made by ${mod.metadata.author}.`
		);
		new InfoBlock(menu, "A message from the author",
			`First of all, thank you for trying the shapez neuro integration.<br>
			It may be complex and frustrating to use, and I will try to make it better. But this will take time.<br>
			I, alone, already spent half a year trying to make this and, looking back, maybe it wasn't the best idea.<br>
			I already knew this game will be hard to describe with words and harder to play. But I guess I made it,
			and it woudln't be posible without the help of the whole neuro sama community, the nerds in #programming,
			the great creator of the best AI streamers on twitch and, of course, you.<br>
			Thank you for reading this. I hope you enjoy this integration.<br><br>
			Infernal-Ekoro`
		);
	}
}