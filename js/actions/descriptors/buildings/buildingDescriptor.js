import { Entity } from "shapez/game/entity";
import { BeltDescriptor } from "./beltDescriptor";
import { MinerDescriptor } from "./minerDescriptor";
import { GameRoot } from "shapez/game/root";
import { MetaBuilding } from "shapez/game/meta_building";
import { StaticEntityInfo } from "./staticEntityInfo";
import { ComponentsInfo } from "./components/componentsInfo";

export class BuildingDescriptor {
	/**
	 * @param {Entity} entity
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static describe(entity) {
		//console.log(entity);
		const response = {msg:"", describedIDs:[entity.uid]};
		response.msg += `${StaticEntityInfo.describe(entity.components).msg}\r\n`;
		const description = ComponentsInfo.describe(entity);
		response.msg += description.msg;
		for(let i = 0; i < description.describedIDs.length; i++) {
			response.describedIDs.push(description.describedIDs[i]);
		}

		return response;
	}

	/**
	 * @param {GameRoot} root
	 * @param {MetaBuilding} building
	 * @returns {string}
	 * */
	static getInfoAndStats(root, building) {
		const stats = building.getAdditionalStatistics(root, "default");
		if (stats.length <= 0) {
			return "";
		}
		let msg = "";
		let info = this.#getInfo(building);
		if (info != "") {
			msg = `${building.getId()}: ${info}\r\nStats:\r\n`;
		}
		else {
			msg = `Stats for ${building.getId()}:\r\n`;
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

	/**
	 * @param {MetaBuilding} building
	 * @returns {string}
	 * */
	static #getInfo(building) {
		switch (building.getId()) {
			case "belt":
				return BeltDescriptor.info;
			case "miner":
				return MinerDescriptor.info;
			default:
				return "";
		}
	}
}