import { Vector } from "shapez/core/vector";
import { RandomUtils } from "../../../custom/randomUtils";
import { ShapeCode } from "../shapes/shapeCode";
import { BaseItem } from "shapez/game/base_item";
import { MapChunkView } from "shapez/game/map_chunk_view";

export class SimplePatchDescriptor {
	/**
	 * @param {MapChunkView} chunk
	 * @param {{pos: Vector; item: BaseItem; size: number}} patch
	 * @returns {string}
	 * */
	static describe(chunk, patch) {
		let msg = "";
		const patchPos = new Vector(chunk.tileX, chunk.tileY);
		patchPos.x = Math.floor(patchPos.x + patch.pos.x);
		patchPos.y = Math.floor(patchPos.y + patch.pos.y);
		const patchType = patch.item.getItemType();

		switch (patchType) {
			case "shape":
				const shapeKey = patch.item.getAsCopyableKey();
				const desc = ShapeCode.describe(shapeKey);
				msg = `${desc} shape patch ` +
				`found at x: ${patchPos.x}, y: ${patchPos.y}`;
				break;
			case "color":
				const colorKey = patch.item.getAsCopyableKey();
				const colorName = RandomUtils.capitalizeFirst(colorKey);
				msg = `${colorName} color patch ` +
				`found at x: ${patchPos.x}, y: ${patchPos.y}`;
				break;
			default:
				msg = `unknown patch ` +
				`found at x: ${patchPos.x}, y: ${patchPos.y}`;
				break;
		}

		return msg;
	}
}