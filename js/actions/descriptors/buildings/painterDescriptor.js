import { EntityComponentStorage } from "shapez/game/entity_components";

export class PainterDescriptor {

	/**
	 * @param {EntityComponentStorage} painter
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static describe(painter) {
		const slotsByDir = new Map();
		const log = {msg:"", describedIDs:new Array()};
		return log;
	}
}