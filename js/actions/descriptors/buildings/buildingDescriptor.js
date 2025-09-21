import { Entity } from "shapez/game/entity";
import { StaticEntityInfo } from "./staticEntityInfo";
import { ComponentsInfo } from "./components/componentsInfo";

export class BuildingDescriptor {
	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {Entity} entity
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static describe(root, entity, force = false) {
		const response = {msg:"", describedIDs:[entity.uid], skipped:[]};
		response.msg += `${StaticEntityInfo.describe(root, entity.components).msg}`;
		if (response.msg != "") { response.msg += "\n"; }
		const description = ComponentsInfo.describe(entity, force);
		if (description.msg == "SKIP") {
			response.msg = "SKIP";
		}
		else {
			response.msg += description.msg;
			for(let i = 0; i < description.describedIDs.length; i++) {
				response.describedIDs.push(description.describedIDs[i]);
			}
		}

		return response;
	}
}