import { Rectangle } from "shapez/core/rectangle";
import { GameRoot } from "shapez/game/root";

// Tells you the current view in a rectangle coordinates
export class CameraLimits {
	/**
	 * @param {GameRoot} root
	 * @returns {Rectangle}
	 * */
	static getVisibleLimits(root) {
		const visibleRect = root.camera.getVisibleRect();
		const tileRect = visibleRect.toTileCullRectangle();
		return tileRect;
	}
}