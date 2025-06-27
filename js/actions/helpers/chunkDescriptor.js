import { Vector } from "shapez/core/vector";
import { BaseItem } from "shapez/game/base_item";
import { MapChunkView } from "shapez/game/map_chunk_view";

export class ChunkDescriptor {
	/** @type {MapChunkView} */ #chunk

	/** @param {MapChunkView} chunk */ 
	constructor(chunk) {
		this.#chunk = chunk;
	}

	/** @returns {string} */
	simple() {
		let msg = "";
		const patches = this.#chunk.patches;
		for (let i = 0; i < patches.length; i++) {
			msg += this.#describePatch(patches[i]);
			if (i + 1 < patches.length) {
				msg += "\r\n";
			}
		}

		return msg;
	}

	/**
	 * @param { {pos: Vector; item: BaseItem; size: number}} patch
	 * @returns {string}
	 * */
	#describePatch(patch) {
		let msg = "";
		const patchPos = new Vector(this.#chunk.tileX, this.#chunk.tileY);
		patchPos.x = Math.floor(patchPos.x + patch.pos.x);
		patchPos.y = Math.floor(patchPos.y + patch.pos.y);
		const patchType = patch.item.getItemType();

		switch (patchType) {
			case "shape":
				msg = `${patch.item.getAsCopyableKey()} shape patch ` +
				`found at x: ${patchPos.x}, y: ${patchPos.y}`;
				break;
			case "color":
				msg = `${patch.item.getAsCopyableKey()} color patch ` +
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