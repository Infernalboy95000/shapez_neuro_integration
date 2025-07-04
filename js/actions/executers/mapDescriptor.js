import { MapChunkView } from "shapez/game/map_chunk_view";
import { ChunkDescriptor } from "../helpers/chunkDescriptor";
import { Vector } from "shapez/core/vector";
import { RandomUtils } from "../../custom/randomUtils";

export class MapDescriptor {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {Map<string, ChunkDescriptor>} */ #patches;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;
	}

	// Scans for nearby patches
	/** @returns {string} */
	scanNearbyPatches() {
		this.#patches = this.#getPatchDescriptors(this.#getVisibleChunks());
		return this.#simplePatchDescriptior(this.#patches);
	}

	/**
	 * @param {Vector} pos 
	 * @returns {string}
	 */
	fullyDescribePatch(pos) {
		if (!this.#patches) {
			this.scanNearbyPatches();
		}
		
		const chunk = this.#getChunkOnPosition(pos);
		if (chunk == null) {
			return `Sorry. There's no terrain generated at x: ${pos.x}, y: ${pos.y} yet. Move closer to create it.`;
		}
		else {
			const formattedPos = RandomUtils.formatPosition(chunk.x, chunk.y);
			if (this.#patches.has(formattedPos)) {
				const chunkDescriptor = this.#patches.get(formattedPos);
				return chunkDescriptor.advanced(pos);
			}
			else {
				return `Sorry. There're no patches nearby x:${pos.x}, y:${pos.y}`;
			}
		}
	}

	/**
	 * @param {Map<string, ChunkDescriptor>} chunks
	 * @returns {string}
	 * */
	#simplePatchDescriptior(chunks) {
		let msg = "";
		chunks.forEach(chunk => {
			msg += chunk.simple();
			msg += "\r\n";
		});

		if (msg == "") {
			msg = "No patches found here.";
		}
		return msg;
	}

	/**
	 * @param {Map<string, MapChunkView>} chunks
	 * @returns {Map<string, ChunkDescriptor>}
	 * */
	#getPatchDescriptors(chunks) {
		/** @type {Map<string, ChunkDescriptor>} */
		const finds = new Map();

		chunks.forEach((chunk, key) => {
			if (chunk.patches.length > 0) {
				finds.set(key, new ChunkDescriptor(chunk));
			}
		});
		return finds;
	}

	/** @returns {Map<string, MapChunkView>} */
	#getVisibleChunks() {
		const chunks = this.#root.map.chunksById;
		/** @type {Map<string, MapChunkView>} */
		const visibleChunks = new Map();

		chunks.forEach((chunk, key) => {
			if (this.#isChunkVisible(chunk)) {
				visibleChunks.set(key, chunk);
			}
		});

		return visibleChunks;
	}

	/**
	 * @param {MapChunkView} chunk
	 * @returns {boolean} */
	#isChunkVisible(chunk) {
		const visible = this.#root.camera.getVisibleRect();
		return visible.containsRect(chunk.worldSpaceRectangle);
	}

	/**
	 * @param {Vector} pos 
	 * @returns {MapChunkView}
	 */
	#getChunkOnPosition(pos) {
		return this.#root.map.getChunkAtTileOrNull(pos.x, pos.y);
	}
}