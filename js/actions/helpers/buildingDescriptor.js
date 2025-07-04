import { Vector } from "shapez/core/vector";
import { BaseItem } from "shapez/game/base_item";
import { MapChunkView } from "shapez/game/map_chunk_view";
import { ShapeCode } from "./shapeCode";
import { RandomUtils } from "../../custom/randomUtils";
import { EntityComponentStorage } from "shapez/game/entity_components";
import { RotationCodes } from "./rotationCodes";

export class BuildingDescriptor {
	/** @type {MapChunkView} */ #chunk
	/** @type {Vector} */ #pos;

	/** @param {MapChunkView} chunk */ 
	constructor(chunk) {
		this.#chunk = chunk;
	}

	/** @returns {string} */
	test() {
		let msg = "";
		const buildings = this.#chunk.containedEntitiesByLayer.regular;
		for (let i = 0; i < buildings.length; i++) {
			msg += this.#describeBuildingSimple(buildings[i].components);
			if (i + 1 < msg.length) {
				msg += "\r\n";
			}
		}

		return msg;
	}

	/**
	 * @param {EntityComponentStorage} entitiy
	 * @returns {string}
	 * */
	#describeBuildingSimple(entitiy) {
		console.log(entitiy);
		const info = entitiy.StaticMapEntity;
		const building = info.getMetaBuilding();
		const buildName = RandomUtils.capitalizeFirst(building.getId());

		return `${buildName} found at ` +
		`x: ${info.origin.x}, y: ${info.origin.y} ` +
		`facing: ${RotationCodes.getRotationName(info.rotation)}`
	}
}