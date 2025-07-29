import { Entity } from "shapez/game/entity";
import { BeltDescriptor } from "./beltDescriptor";
import { MinerDescriptor } from "./minerDescriptor";
import { HubDescriptor } from "./hubDescriptor";
import { GameRoot } from "shapez/game/root";
import { MetaBuilding } from "shapez/game/meta_building";

export class BuildingDescriptor {
	/**
	 * @param {Entity} building
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static describe(building) {
		const buildingName = building.components.StaticMapEntity.getMetaBuilding().getId();
		switch (buildingName) {
			case "belt":
				return BeltDescriptor.describe(building.components);
			case "miner":
				return MinerDescriptor.describe(building.components);
			case "hub":
				return HubDescriptor.describe(building.components);
			default:
				return {msg:"Unknown building", describedIDs:[]};
		}
	}

	/**
	 * @param {GameRoot} root
	 * @param {MetaBuilding} building
	 * @returns {string}
	 * */
	static getInfo(root, building) {
		const stats = building.getAdditionalStatistics(root, "default");
		if (stats.length <= 0) {
			return "";
		}

		let msg = `Stats for ${building.getId()}:\r\n`;
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