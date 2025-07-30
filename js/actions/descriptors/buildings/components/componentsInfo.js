import { Entity } from "shapez/game/entity";
import { ItemAcceptorInfo } from "./ItemAcceptorInfo";
import { ItemEjectorInfo } from "./ItemEjectorInfo";

export class ComponentsInfo {
	static components = {
		"ItemAcceptor": (e) => {return ItemAcceptorInfo.describe(e)},
		"ItemEjector": (e) => {return ItemEjectorInfo.describe(e)}
	}

	/**
	 * @param {Entity} entity
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 */
	static describe(entity) {
		const result = {msg:"", describedIDs:[]};
		for (const [key, _] of Object.entries(entity.components)) {
			if (this.components[key]) {
				const response = this.components[key](entity.components);
				result.msg += `${response.msg}\r\n`;
				for (let i = 0; i < response.describedIDs.length; i++) {
					result.describedIDs.push(response.describedIDs[i]);
				}
			}
		}

		return result;
	}
}