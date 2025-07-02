import { Vector } from "shapez/core/vector";
import { BaseItem } from "shapez/game/base_item";
import { MapChunkView } from "shapez/game/map_chunk_view";
import { ShapeCode } from "./shapeCode";
import { RandomUtils } from "../../custom/randomUtils";
import { SdkAction } from "../definitions/sdkAction";
import { SdkClient } from "../../sdkClient";

export class ChunkDescriptor {
	/** @type {MapChunkView} */ #chunk
	/** @type {Map<string, SdkAction>} */ #chunkActions;

	/** @param {MapChunkView} chunk */ 
	constructor(chunk) {
		this.#chunk = chunk;
		this.#chunkActions = new Map();
	}

	/** @returns {string} */
	simple() {
		let msg = "";
		const patches = this.#chunk.patches;
		this.#chunkActions.clear();
		for (let i = 0; i < patches.length; i++) {
			msg += this.#describePatch(patches[i]);
			if (i + 1 < patches.length) {
				msg += "\r\n";
			}
		}

		return msg;
	}

	announce() {
		SdkClient.registerActions(Array.from(this.#chunkActions.values()))
	}

	remove() {
		SdkClient.removeActions(Array.from(this.#chunkActions.keys()));
	}

	clear() {
		this.remove();
		this.#chunkActions.clear();
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
				const spapeKey = patch.item.getAsCopyableKey();
				const shapeCodeDesc = ShapeCode.describeShapeCode(spapeKey);
				const shapeCodeName = ShapeCode.nameShapeCode(spapeKey);
				msg = `${shapeCodeDesc} shape patch ` +
				`found at x: ${patchPos.x}, y: ${patchPos.y}`;
				this.#describePatchAction(`${shapeCodeDesc} shape`, patchPos);
				break;
			case "color":
				const colorKey = patch.item.getAsCopyableKey();
				const colorName = RandomUtils.capitalizeFirst(colorKey);
				msg = `${colorName} color patch ` +
				`found at x: ${patchPos.x}, y: ${patchPos.y}`;
				this.#describePatchAction(`${colorName} color`, patchPos);
				break;
			default:
				msg = `unknown patch ` +
				`found at x: ${patchPos.x}, y: ${patchPos.y}`;
				this.#describePatchAction(`unknown`, patchPos);
				break;
		}

		return msg;
	}

	/**
	 * @param {string} desc
	 * @param {Vector} pos
	 * */
	#describePatchAction(desc, pos) {
		const action = new SdkAction(
			`describe_patch_at_x${pos.x}_y${pos.y}`,
			`Fully describe all positions that compose the ` +
			`${desc} patch at x: ${pos.x}, y: ${pos.y}`
		);

		this.#chunkActions.set(`${pos.x}|${pos.y}`, action);
	}
}