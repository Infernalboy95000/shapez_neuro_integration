import { globalConfig } from "shapez/core/config";
import { Vector } from "shapez/core/vector";

/** Moves the camera arround the map */
export class CameraMover {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(root) {
		this.#root = root;
	}

	/**
	 * 
	 * @param {number} posX
	 * @param {number} posY
	 * @returns {{valid:boolean, msg:string}}
	 */
	move(posX, posY) {
		const tile = new Vector(posX, posY);
		const focus = tile.toWorldSpace();
		const center = this.#root.camera.center;
		focus.x += globalConfig.halfTileSize;
		focus.y += globalConfig.halfTileSize;

		if (this.#isTooClose(center, focus)) {
			return {valid:false, msg:`You're already at that position.`};
		}
		else {
			this.#root.camera.setDesiredCenter(focus);
			return {valid:true, msg:`Moving to x: ${tile.x}, y: ${tile.y}.`};
		}
	}

	/**
	 * 
	 * @param {number} zoomPercent
	 * @returns {{valid:boolean, msg:string}}
	 */
	zoom(zoomPercent) {
		const zoom = zoomPercent * 0.01;
		if (zoom == this.#root.camera.zoomLevel) {
			return {valid:false, msg:`Zoom is already at ${zoomPercent}%.`};
		}
		else {
			this.#root.camera.setDesiredZoom(zoom);
			return {valid:true, msg:`Adjusting zoom to ${zoomPercent}%.`};
		}
	}

	/**
	 * @param {Vector} from
	 * @param {Vector} to
	 * @returns {boolean}
	*/
	#isTooClose(from, to) {
		if (from.distance(to) >= globalConfig.halfTileSize) {
			return false;
		}
		return true;
	}
}