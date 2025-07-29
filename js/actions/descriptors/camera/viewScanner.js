import { Rectangle } from "shapez/core/rectangle";
import { MapChunkView } from "shapez/game/map_chunk_view";
import { GameRoot } from "shapez/game/root";

// Helps telling you what's in your current view
export class ViewScanner {
	/**
	 * @param {GameRoot} root
	 * @returns {Rectangle}
	 * */
	static getVisibleLimits(root) {
		const visibleRect = root.camera.getVisibleRect();
		const tileRect = visibleRect.toTileCullRectangle();
		return tileRect;
	}

	/**
	 * @param {GameRoot} root
	 * @returns {Map<string, MapChunkView>}
	 * */
	static getVisibleChunks(root) {
		const chunks = root.map.chunksById;
		/** @type {Map<string, MapChunkView>} */
		const visibleChunks = new Map();

		chunks.forEach((chunk, key) => {
			if (this.isChunkVisible(root, chunk)) {
				visibleChunks.set(key, chunk);
			}
		});

		return visibleChunks;
	}

	/**
	 * @param {GameRoot} root
	 * @param {MapChunkView} chunk
	 * @returns {boolean} */
	static isChunkVisible(root, chunk) {
		const visible = root.camera.getVisibleRect();
		return visible.containsRect(chunk.worldSpaceRectangle);
	}
}