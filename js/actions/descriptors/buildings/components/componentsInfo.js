import { Entity } from "shapez/game/entity";
import { ItemAcceptorInfo } from "./ItemAcceptorInfo";
import { ItemEjectorInfo } from "./ItemEjectorInfo";
import { BeltInfo } from "./beltInfo";
import { UndergroundBeltInfo } from "./undergroundBeltInfo";

export class ComponentsInfo {
	static components = {
		"ItemAcceptor": (c, f) => {return ItemAcceptorInfo.describe(c)},
		"ItemEjector": (c, f) => {return ItemEjectorInfo.describe(c)},
		"Belt": (c, f) => {return BeltInfo.describe(c)},
		"UndergroundBelt": (c, f) => {return UndergroundBeltInfo.describe(c, f)}
	}

	/**
	 * @param {Entity} entity
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 */
	static describe(entity, force = false) {
		const result = {msg:"", describedIDs:[]};
		for (const [key, _] of Object.entries(entity.components)) {
			if (this.components[key]) {
				const response = this.components[key](entity.components, force);
				if (response.msg == "SKIP") {
					result.msg = response.msg;
					result.describedIDs = [];
					return result;
				}
				if (response.msg != "") {
					result.msg += `${response.msg}`;
				}
				for (let i = 0; i < response.describedIDs.length; i++) {
					result.describedIDs.push(response.describedIDs[i]);
				}
			}
		}

		return result;
	}
}