import { MetaBuilding } from "shapez/game/meta_building";
import { T } from "shapez/translations";

export class BuildingStats {
	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {MetaBuilding} building
	 * @param {string} variant
	 * @returns {string}
	 * */
	static describe(root, building, variant) {
		const stats = building.getAdditionalStatistics(root, variant);
		let msg = "";
		const displayName = T.buildings[building.getId()][variant].name;
		let info = "";

		if (!root.app.settings.getAllSettings().compactBuildingInfo) {
			info = T.buildings[building.getId()][variant].description;
		}

		if (info != "") {
			msg = `${displayName}: ${info}\r\n`;
			if (stats.length > 0) {
				msg += "Stats: "
			}
		}
		else if (stats.length > 0) {
			msg = `Stats for ${displayName}: `;
		}
		else {
			msg = `No stats on this building.`;
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