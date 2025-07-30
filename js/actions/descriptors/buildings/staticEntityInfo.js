import { Vector } from "shapez/core/vector";
import { EntityComponentStorage } from "shapez/game/entity_components";
import { RandomUtils } from "../../../custom/randomUtils";
import { T } from "shapez/translations";

export class StaticEntityInfo {

	/**
	 * @param {EntityComponentStorage} components
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 */
	static describe(components) {
		const log = {msg:"", describedIDs:[]};
		// We skip belts due to them having diferent introductions
		const belt = components.Belt;
		if (belt && belt.assignedPath.entityPath.length > 0) {
			return log;
		}

		const staticEntity = components.StaticMapEntity;
		const origin = staticEntity.origin;
		const entitiyName = staticEntity.getMetaBuilding().getId();
		const buildName = T.buildings[entitiyName].default.name;
		const variant = staticEntity.getVariant();

		log.msg = `Found${variant == "default" ? " " : ` ${variant} `}${buildName} ` +
			`at x: ${origin.x}, y: ${origin.y}.`;

		const direction = staticEntity.rotation;
		const size = RandomUtils.directionalSize(staticEntity.getTileSize(), direction);
		const sizeAbs = size.abs();
		if (size != new Vector(1, 1)) {
			log.msg +=`\r\nIt's ` +
			`${sizeAbs.x} tile${sizeAbs.x > 1 ? "s" : ""} long in x ${size.x > 0 ? "positive" : "negative"}, `+
			`${sizeAbs.y} tile${sizeAbs.y > 1 ? "s" : ""} tall in y ${size.y > 0 ? "positive" : "negative"}.`;
		}

		if (!staticEntity.getMetaBuilding().getIsRemovable) {
			log.msg += "\r\nWarning: It cannot be removed!"
		}
		return log;
	}
}