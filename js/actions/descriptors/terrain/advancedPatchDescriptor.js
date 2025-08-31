import { Vector } from "shapez/core/vector";
import { BaseItem } from "shapez/game/base_item";
import { MapChunkView } from "shapez/game/map_chunk_view";
import { RandomUtils } from "../../../custom/randomUtils";
import { ShapeCode } from "../shapes/shapeCode";
import { ColorCodes } from "../shapes/colorCodes";

export class AdvancedPatchDescriptor {
	/**
	 * @param {MapChunkView} chunk
	 * @param {{pos: Vector; item: BaseItem; size: number}} patch
	 * @returns {string}
	 * */
	static describe(chunk, patch) {
		let msg = "";
		const patchCode = patch.item.getAsCopyableKey();
		const layerPatches = this.#collectLayerInfo(chunk);
		const layerPatch = layerPatches.get(patchCode);
		if (layerPatch) {
			msg = this.#describeLayerInfo(patch.item, layerPatch);
		}
		return msg;
	}

	/**
	 * @param {MapChunkView} chunk
	 * @returns {Map<string, {type: string; positions: Array<Vector>}>}
	 * */
	static #collectLayerInfo(chunk) {
		/** @type {Map<string, {type: string; positions: Array<Vector>}>} */
		const finds = new Map();
		const chunkPos = new Vector(chunk.tileX, chunk.tileY);
		const layer = chunk.lowerLayer;
		const space = chunk.tileSpaceRectangle;

		for (let x = 0; x < space.w; x++) {
			for (let y = 0; y < space.h; y++) {
				if (layer[x][y] != null) {
					const key = layer[x][y].getAsCopyableKey();
					const pos = new Vector(chunkPos.x + x, chunkPos.y + y);
					if (finds.has(key)) {
						const tiles = finds.get(key);
						tiles.positions.push(pos);
						finds.set(key, tiles);
					}
					else {
						const tilesFound = {
							type: layer[x][y].getItemType(),
							positions: [pos]
						};
						finds.set(key, tilesFound);
					}
				}
			}
		}
		return finds;
	}

	/**
	 * @param {BaseItem} item
	 * @param {{type: string; positions: Array<Vector>}} tiles
	 * @returns {string}
	 * */
	static #describeLayerInfo(item, tiles) {
		let describedKey = "unknown";
		if (tiles.type == "color") {
			describedKey = ColorCodes.describe(item.getAsCopyableKey());
		}
		else if (tiles.type == "shape") {
			// @ts-ignore
			describedKey = ShapeCode.describe(item.definition);
		}

		let msg = `Patch of ${describedKey} ${tiles.type} found in these positions:`;
		let lastX, currentX;
		let yFinds = [];

		for (let i = 0; i < tiles.positions.length; i++) {
			currentX = tiles.positions[i].x;
			if (currentX != lastX) {
				if (yFinds.length > 0) {
					msg += `\r\non x: ${lastX}, `;

					if (yFinds.length == 1) {
						msg += `y: ${yFinds[0]}`;
					}
					else if (yFinds.length == 2) {
						msg += `y: ${yFinds[0]} and y: ${yFinds[1]}`;
					}
					else {
						msg += `from y: ${yFinds[0]} to y: ${yFinds[yFinds.length - 1]}`;
					}
				}
				lastX = currentX;
				yFinds = [];
			}

			yFinds.push(tiles.positions[i].y);
		}

		if (yFinds.length > 0) {
			msg += `\non x: ${lastX}`;

			if (yFinds.length == 1) {
				msg += ` y: ${yFinds[0]}`;
			}
			else if (yFinds.length == 2) {
				msg += ` y: ${yFinds[0]} and y: ${yFinds[1]}`;
			}
			else {
				msg += `, from y: ${yFinds[0]} to y: ${yFinds[yFinds.length - 1]}`;
			}
		}

		return msg;
	}
}