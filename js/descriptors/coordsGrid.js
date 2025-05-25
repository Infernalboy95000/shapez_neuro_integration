import { MapChunkView } from "shapez/game/map_chunk_view";

export class CoordsGrid {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 */
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
				const map = this;
				if (coords.#mod.settings.coordsGrid) {
					coords.#drawGrid(map, parameters);
				}
			}
		);
	}

	/**
	 * 
	 * @param {MapChunkView} map 
	 * @param {import("shapez/core/draw_utils").DrawParameters} parameters 
	 */
	#drawGrid(map, parameters) {
		const chunkWidth = map.worldSpaceRectangle.w / map.tileSpaceRectangle.w;
		const chunkHeight = map.worldSpaceRectangle.h / map.tileSpaceRectangle.h;
		
		const context = parameters.context;
		context.fillStyle = "rgb(113, 213, 202)";
		context.shadowColor = "rgb(129, 163, 159)";
		context.shadowOffsetX = 1.5;
		context.shadowOffsetY = 1.5;
		context.shadowBlur = 1;
		context.font = "6px GameFont";

		for (let i = 0; i < map.tileSpaceRectangle.w; i++) {
			for (let j = 0; j < map.tileSpaceRectangle.h; j++) {
				context.fillText(`x: ${map.tileX + i}`, map.worldSpaceRectangle.x + (i * chunkWidth), map.worldSpaceRectangle.y + (j * chunkHeight) - 8, chunkWidth);
				context.fillText(`y: ${map.tileY + j}`, map.worldSpaceRectangle.x + (i * chunkWidth), map.worldSpaceRectangle.y + (j * chunkHeight) - 2, chunkWidth);
			}
		}
	}

	/* Those are the zoomed out chunk coordinates
	this.modInterface.runAfterMethod(MapChunkAggregate, "drawOverlay", function(parameters) {
		console.log(`Coords -> X: ${this.x}, Y: ${this.y}`);
	});
	*/
}