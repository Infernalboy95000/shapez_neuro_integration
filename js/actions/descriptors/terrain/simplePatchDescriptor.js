import { Vector } from "shapez/core/vector";
import { RandomUtils } from "../../../custom/randomUtils";
import { BaseItem } from "shapez/game/base_item";
import { MapChunkView } from "shapez/game/map_chunk_view";
import { SignalDescriptor } from "../signals/signalDescriptor";

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
		const description = SignalDescriptor.Describe(patch.item);

		switch (patchType) {
			case "shape":
				msg = `${description} shape patch ` +
				`found at x: ${patchPos.x}, y: ${patchPos.y}.`;
				break;
			case "color":
				msg = `${description} color patch ` +
				`found at x: ${patchPos.x}, y: ${patchPos.y}.`;
				break;
			default:
				msg = `unknown patch ` +
				`found at x: ${patchPos.x}, y: ${patchPos.y}.`;
				break;
		}

		return RandomUtils.capitalizeFirst(msg);
	}
}