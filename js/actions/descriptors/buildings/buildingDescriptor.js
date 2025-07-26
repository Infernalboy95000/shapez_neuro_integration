import { Entity } from "shapez/game/entity";
import { BeltDescriptor } from "./beltDescriptor";
import { MinerDescriptor } from "./minerDescriptor";
import { HubDescriptor } from "./hubDescriptor";

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
}