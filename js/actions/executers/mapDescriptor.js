import { MapChunkView } from "shapez/game/map_chunk_view";
import { ChunkDescriptor } from "../helpers/chunkDescriptor";

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

	// Describe the current map view
	/** @returns {string} */
	describePatches() {
		this.#patches = this.#getPatchDescriptors(this.#getVisibleChunks());
		return this.#simplePatchDescriptior(this.#patches);
	}

	announceFullDescriptors() {
		if (!this.#patches) {
			return;
		}

		this.#patches.forEach((chunk) => {
			chunk.announce();
		});
	}

	removeAllDescriptors() {
		if (!this.#patches) {
			return;
		}

		this.#patches.forEach((chunk) => {
			chunk.remove();
		});
	}

	clearInvisibleDescriptors() {
		if (!this.#patches) {
			return;
		}
		const visibleChunks = this.#getVisibleChunks();
		visibleChunks.forEach((chunk, key) => {
			if (this.#isChunkVisible(chunk) && this.#patches.has(key)) {
				this.#patches.get(key).remove();
			}
		});
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

		chunks.forEach((value, key) => {
			if (value.patches.length > 0) {
				finds.set(key, new ChunkDescriptor(value));
			}
		});
		return finds;
	}

	/** @returns {Map<string, MapChunkView>} */
	#getVisibleChunks() {
		const chunks = this.#root.map.chunksById;
		/** @type {Map<string, MapChunkView>} */
		const visibleChunks = new Map()

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
}