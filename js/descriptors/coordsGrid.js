import { MapChunkView } from "shapez/game/map_chunk_view";

export class CoordsGrid {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;

	/** @param {import("shapez/mods/mod").Mod} mod */
	constructor(mod) {
		this.#mod = mod;
		this.#asignDrawFunction();
	}

	#asignDrawFunction() {
		const coords = this;

		this.#mod.modInterface.runAfterMethod(
			MapChunkView,
			"drawForegroundStaticLayer",
			function(parameters) {
				if (coords.#canDrawChunk(this, parameters)) {
					coords.#drawGrid(this, parameters);
				}
			}
		);
	}

	/**
	 * @param {MapChunkView} chunk
	 * @param {import("shapez/core/draw_utils").DrawParameters} parameters 
	 * @returns {boolean}
	 * */
	#canDrawChunk(chunk, parameters) {
		if (!this.#mod.settings.coordsGrid) {
			return false;
		}

		if (!parameters.visibleRect.containsRect(chunk.worldSpaceRectangle)) {
			return false;
		}

		return true;
	}

	/**
	 * 
	 * @param {MapChunkView} chunk 
	 * @param {import("shapez/core/draw_utils").DrawParameters} parameters 
	 */
	#drawGrid(chunk, parameters) {
		const chunkWidth = chunk.worldSpaceRectangle.w / chunk.tileSpaceRectangle.w;
		const chunkHeight = chunk.worldSpaceRectangle.h / chunk.tileSpaceRectangle.h;
		const context = this.#contextGridFont(parameters);

		for (let i = 0; i < chunk.tileSpaceRectangle.w; i++) {
			for (let j = 0; j < chunk.tileSpaceRectangle.h; j++) {
				context.fillText(
					`x: ${chunk.tileX + i}`,
					chunk.worldSpaceRectangle.x + (i * chunkWidth) + (chunkWidth / 6),
					chunk.worldSpaceRectangle.y + (j * chunkHeight) + (chunkHeight / 3),
					chunkWidth
				);

				context.fillText(
					`y: ${chunk.tileY + j}`,
					chunk.worldSpaceRectangle.x + (i * chunkWidth)  + (chunkWidth / 6),
					chunk.worldSpaceRectangle.y + (j * chunkHeight) + (chunkHeight / 3) + 8,
					chunkWidth
				);
			}
		}
	}

	/**
	 * @param {import("shapez/core/draw_utils").DrawParameters} parameters
	 * @returns {CanvasRenderingContext2D}
	 * */
	#contextGridFont(parameters) {
		const context = parameters.context;
		context.fillStyle = "rgb(113, 213, 202)";
		context.shadowColor = "rgb(129, 163, 159)";
		context.shadowOffsetX = 1.5;
		context.shadowOffsetY = 1.5;
		context.shadowBlur = 1;
		context.font = "6px GameFont";

		return context;
	}

	/* Those are the zoomed out chunk coordinates
	this.modInterface.runAfterMethod(MapChunkAggregate, "drawOverlay", function(parameters) {
		console.log(`Coords -> X: ${this.x}, Y: ${this.y}`);
	});
	*/
}