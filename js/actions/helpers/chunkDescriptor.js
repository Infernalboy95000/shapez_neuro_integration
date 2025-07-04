import { Vector } from "shapez/core/vector";
import { BaseItem } from "shapez/game/base_item";
import { MapChunkView } from "shapez/game/map_chunk_view";
import { ShapeCode } from "./shapeCode";
import { RandomUtils } from "../../custom/randomUtils";

export class ChunkDescriptor {
	/** @type {MapChunkView} */ #chunk
	/** @type {Vector} */ #pos;

	/** @param {MapChunkView} chunk */ 
	constructor(chunk) {
		this.#chunk = chunk;
	}

	/** @returns {string} */
	simple() {
		let msg = "";
		const patches = this.#chunk.patches;
		for (let i = 0; i < patches.length; i++) {
			msg += this.#describePatchSimple(patches[i]);
			if (i + 1 < patches.length) {
				msg += "\r\n";
			}
		}

		return msg;
	}

	/**
	 * @param {Vector} pos;
	 * @returns {string}
	 */
	advanced(pos) {
		let msg = "Error";
		const formattedPos = RandomUtils.formatVector(pos);

		const finds = this.#collectLayerInfo();
		finds.forEach((tiles, patchCode) => {
			if (tiles.positions.find((tile) => {
				return tile.key == formattedPos;
			})) {
				msg = this.#describeLayerInfo(patchCode, tiles);
			}
		});

		if (msg == "Error" && finds.size > 0) {
			msg = "";
			finds.forEach((tiles, patchCode) => {
				msg += this.#describeLayerInfo(patchCode, tiles);
				msg += "\n";
			});
		}
		else {
			msg = `Sorry. There're no patches nearby x:${pos.x}, y:${pos.y}`;
		}

		return msg;
	}

	/** @returns {Map<string, {type: string; positions: Array<{key:string, vector:Vector}>}>} */
	#collectLayerInfo() {
		/** @type {Map<string, {type: string; positions: Array<{key:string, vector:Vector}>}>} */
		const finds = new Map();

		const chunkPos = new Vector(this.#chunk.tileX, this.#chunk.tileY);
		const layer = this.#chunk.lowerLayer;
		const space = this.#chunk.tileSpaceRectangle;

		/** @type {Array<{key:string, vector:Vector}>} */
		let tilesPositions = [];
		/** @type {{type: string; positions: Array<{key:string, vector:Vector}>}} */
		let tilesFound = {type: "",positions: tilesPositions};

		for (let x = 0; x < space.w; x++) {
			for (let y = 0; y < space.h; y++) {
				if (layer[x][y] != null) {
					const key = layer[x][y].getAsCopyableKey(); //;
					const pos = new Vector(chunkPos.x + x, chunkPos.y + y);
					const posFormatted = RandomUtils.formatVector(pos);
					if (finds.has(key)) {
						tilesPositions = finds.get(key).positions;
						tilesPositions.push({
							key: posFormatted,
							vector: pos
						});
						tilesFound = {
							type: layer[x][y].getItemType(),
							positions: tilesPositions
						};
					}
					else {
						tilesFound = {
							type: layer[x][y].getItemType(),
							positions: [{
								key: posFormatted,
								vector: pos
							}]
						};
					}
					finds.set(key, tilesFound);
				}
			}
		}

		return finds;
	}

	/**
	 * @param {string} patchKey
	 * @param {{type: string; positions: Array<{key:string, vector:Vector}>}} tiles
	 * @returns {string}
	 * */
	#describeLayerInfo(patchKey, tiles) {
		let describedKey = "unknown";
		if (tiles.type == "color") {
			describedKey = RandomUtils.capitalizeFirst(patchKey);
		}
		else if (tiles.type == "shape") {
			describedKey = ShapeCode.describe(patchKey);
		}

		let msg = `Patch of ${describedKey} ${tiles.type} found in these positions:`;
		let lastX, currentX;
		let yFinds = [];

		for (let i = 0; i < tiles.positions.length; i++) {
			currentX = tiles.positions[i].vector.x;
			if (currentX != lastX) {
				if (yFinds.length > 0) {
					msg += `\non x: ${lastX}, `;

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

			yFinds.push(tiles.positions[i].vector.y);
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

	/**
	 * @param {{pos: Vector; item: BaseItem; size: number}} patch
	 * @returns {string}
	 * */
	#describePatchSimple(patch) {
		let msg = "";
		const patchPos = new Vector(this.#chunk.tileX, this.#chunk.tileY);
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