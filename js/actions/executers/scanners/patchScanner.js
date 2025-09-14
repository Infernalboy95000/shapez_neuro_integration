import { Vector } from "shapez/core/vector";
import { SimplePatchDescriptor } from "../../descriptors/terrain/simplePatchDescriptor";
import { ViewScanner } from "../../descriptors/camera/viewScanner";
import { BaseItem } from "shapez/game/base_item";
import { MapChunkView } from "shapez/game/map_chunk_view";
import { AdvancedPatchDescriptor } from "../../descriptors/terrain/advancedPatchDescriptor";
export class PatchScanner {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	
	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	};

	/** @returns {{valid:boolean, msg:string}} */
	scanInView() {
		const result = {valid: false, msg: ""};
		const chunks = ViewScanner.getVisibleChunks();
		chunks.forEach((chunk) => {
			for (let i = 0; i < chunk.patches.length; i++) {
				result.valid = true;
				result.msg += SimplePatchDescriptor.describe(chunk, chunk.patches[i]);
				if (i + 1 < chunk.patches.length) {
					result.msg += "\r\n";
				}
			};
			result.msg += "\r\n";
		});

		if (!result.valid) {
			result.msg = "No patches found here. Try moving somewhere else.";
		}
		return result;
	}

	/**
	 * @param {number} posX @param {number} posY
	 * @returns {{valid:boolean, msg:string}} */
	scanAt(posX, posY) {
		const result = {valid:false, msg:""};
		const chunk = this.#root.map.getChunkAtTileOrNull(posX, posY);
		if (!chunk) {
			result.msg = `Sorry. There's no terrain generated at x: ${posX}, y: ${posY} yet. Move closer to create it.`;
			return result;
		}
		
		if (chunk.patches.length > 1) {
			const closest = this.#getClosestPatch(chunk, new Vector(posX, posY));
			result.valid = true;
			result.msg = AdvancedPatchDescriptor.describe(chunk, closest);
		}
		else if (chunk.patches.length == 1) {
			result.valid = true;
			result.msg = AdvancedPatchDescriptor.describe(chunk, chunk.patches[0]);
		}
		else {
			result.msg = `There're no patches nearby x:${posX}, y:${posY}`;
		}

		return result;
	}

	/**
	 * @param {MapChunkView} chunk
	 * @param {Vector} posTarget
	 * @returns {{pos: Vector, item: BaseItem, size: number}}
	 * */
	#getClosestPatch(chunk, posTarget) {
		const patches = chunk.patches;
		const chunkPos = new Vector(chunk.tileX, chunk.tileY);
		let closestPatch = patches[0];
		let closestDistance = chunkPos.add(closestPatch.pos).distance(posTarget);

		for (let i = 0; i < patches.length; i++) {
			const dist = chunkPos.add(closestPatch.pos).distance(posTarget);
			if (dist < closestDistance) {
				closestPatch = patches[i];
				closestDistance = dist;
			}
		}
		return closestPatch;
	}
}