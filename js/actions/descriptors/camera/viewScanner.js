import { Rectangle } from "shapez/core/rectangle";
import { MapChunkView } from "shapez/game/map_chunk_view";
import { GameRoot } from "shapez/game/root";

// Helps telling you what's in your current view
export class ViewScanner {
	/** @type {GameRoot} */ static #root;

	/** @param {GameRoot} root */
	static asignRoot(root) {
		this.#root = root;
	}

	/** @returns {Rectangle} */
	static getVisibleLimits() {
		const visibleRect = this.#root.camera.getVisibleRect();
		const tileRect = visibleRect.toTileCullRectangle();
		return tileRect;
	}

	/** @returns {Map<string, MapChunkView>} */
	static getVisibleChunks() {
		const chunks = this.#root.map.chunksById;
		/** @type {Map<string, MapChunkView>} */
		const visibleChunks = new Map();

		chunks.forEach((chunk, key) => {
			if (this.isChunkVisible(chunk)) {
				visibleChunks.set(key, chunk);
			}
		});

		return visibleChunks;
	}

	/**
	 * @param {MapChunkView} chunk
	 * @returns {boolean}
	 * */
	static isChunkVisible(chunk) {
		const visible = this.#root.camera.getVisibleRect();
		return visible.containsRect(chunk.worldSpaceRectangle);
	}

	/**
	 * @param {import("shapez/savegame/savegame_typedefs").Entity} entity
	 * @returns {boolean} */
	static isBuildingVisible(entity) {
		const visible = this.#root.camera.getVisibleRect().toTileCullRectangle();
		const buildingRect = entity.components.StaticMapEntity.getTileSpaceBounds()
		return visible.containsRect(buildingRect);
	}
}