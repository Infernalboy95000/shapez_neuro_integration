import { globalConfig } from "shapez/core/config";
import { MapChunkAggregate } from "shapez/game/map_chunk_aggregate";
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
				if (!coords.#mod.settings.coordsGrid) { return; }
				if (coords.#canDrawChunk(this, parameters)) {
					coords.#drawPreciseGrid(this, parameters);
				}
			}
		);

		this.#mod.modInterface.runAfterMethod(
			MapChunkAggregate,
			"drawOverlay",
			function(parameters) {
				if (!coords.#mod.settings.coordsGrid) { return; }
				coords.#tryDrawAggregate(this, parameters);
			}
		);
	}

	/**
	 * @param {MapChunkAggregate} aggregate
	 * @param {import("shapez/core/draw_utils").DrawParameters} parameters 
	 * */
	#tryDrawAggregate(aggregate, parameters) {
		if (!this.#mod.settings.coordsGrid) {return}
		for (let x = 0; x < globalConfig.chunkAggregateSize; x++) {
			for (let y = 0; y < globalConfig.chunkAggregateSize; y++) {
				const chunk = aggregate.root.map
					.getChunk(
						aggregate.x * globalConfig.chunkAggregateSize + x,
						aggregate.y * globalConfig.chunkAggregateSize + y,
					);
				if (this.#canDrawChunk(chunk, parameters)) {
					this.#drawMapGrid(chunk, parameters);
				}
			}
		}
	}

	/**
	 * @param {MapChunkView} chunk
	 * @param {import("shapez/core/draw_utils").DrawParameters} parameters 
	 * @returns {boolean}
	 * */
	#canDrawChunk(chunk, parameters) {
		return parameters.visibleRect.containsRect(chunk.worldSpaceRectangle);
	}

	/**
	 * 
	 * @param {MapChunkView} chunk 
	 * @param {import("shapez/core/draw_utils").DrawParameters} parameters 
	 */
	#drawPreciseGrid(chunk, parameters) {
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
	 * 
	 * @param {MapChunkView} chunk 
	 * @param {import("shapez/core/draw_utils").DrawParameters} parameters 
	 */
	#drawMapGrid(chunk, parameters) {
		const chunkWidth = chunk.worldSpaceRectangle.w / chunk.tileSpaceRectangle.w;
		const chunkHeight = chunk.worldSpaceRectangle.h / chunk.tileSpaceRectangle.h;
		const context = this.#contextMapGridFont(parameters);

		context.fillText(
			`x: ${chunk.tileX}`,
			chunk.worldSpaceRectangle.x,
			chunk.worldSpaceRectangle.y + (chunkHeight / 2),
			chunkWidth * 5
		);

		context.fillText(
			`y: ${chunk.tileY}`,
			chunk.worldSpaceRectangle.x,
			chunk.worldSpaceRectangle.y + chunkHeight + (chunkHeight / 3),
			chunkWidth * 5
		);
	}

	/**
	 * @param {import("shapez/core/draw_utils").DrawParameters} parameters
	 * @returns {CanvasRenderingContext2D}
	 * */
	#contextGridFont(parameters) {
		const context = parameters.context;
		context.fillStyle = "rgba(48, 172, 158, 1)";
		context.font = "8px GameFont";

		return context;
	}

	/**
	 * @param {import("shapez/core/draw_utils").DrawParameters} parameters
	 * @returns {CanvasRenderingContext2D}
	 * */
	#contextMapGridFont(parameters) {
		const context = parameters.context;
		context.fillStyle = "rgba(58, 193, 177, 1)";
		context.font = "18px GameFont";

		return context;
	}
}