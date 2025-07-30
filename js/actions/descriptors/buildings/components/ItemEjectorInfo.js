import { EntityComponentStorage } from "shapez/game/entity_components";

export class ItemEjectorInfo {
	/**
	 * @param {EntityComponentStorage} components
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 */
	static describe(components) {
		const log = {msg:"", describedIDs:new Array()};
		return log;
	}
}