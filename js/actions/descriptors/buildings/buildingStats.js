import { MetaBuilding } from "shapez/game/meta_building";
import { T } from "shapez/translations";

export class BuildingStats {
	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {MetaBuilding} building
	 * @returns {string}
	 * */
	static describe(root, building) {
		const stats = building.getAdditionalStatistics(root, "default");
		let msg = "";
		//TODO: Add variants to this
		const displayName = T.buildings[building.getId()].default.name;
		const info = T.buildings[building.getId()].default.description;
		if (info != "") {
			msg = `${displayName}: ${info}\r\n`;
		}
		else if (stats.length > 0) {
			msg = `Stats for ${displayName}: `;
		}
		else {
			msg += "Stats: "
		}

		for (let i = 0; i < stats.length; i++) {
			for (let j = 0; j < stats[i].length; j += 2) {
				const name = stats[i][j];
				const stat = stats[i][j + 1];

				msg += `${name}: ${stat}` +
				`${i + 1 < stats.length ? "\r\n" : ""}`;
			}
		}
		return msg;
	}
}