import { Vector } from "shapez/core/vector";
import { MetaBuilding } from "shapez/game/meta_building";

export class InGameBeltPlanner {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/**
	 * @param {Vector} pos1
	 * @param {Vector} pos2
	 * @param {MetaBuilding} building
	 * @param {boolean} endHotizontal
	 * @returns {boolean}
	 * */
	build(pos1, pos2, building, endHotizontal = true) {
		// Get path to place
		const path = this.#computeBuildPath(pos1, pos2, endHotizontal);

		// Store if we placed anything
		let anythingPlaced = false;

		// Perform this in bulk to avoid recalculations
		this.#root.logic.performBulkOperation(() => {
			for (let i = 0; i < path.length; ++i) {
				const { rotation, tile } = path[i];
				this.#root.hud.parts.buildingPlacer.currentBaseRotation = rotation;
				if (this.#root.hud.parts.buildingPlacer.tryPlaceCurrentBuildingAt(tile)) {
					anythingPlaced = true;
				}
			}
		});

		if (anythingPlaced) {
			this.#root.soundProxy.playUi(building.getPlacementSound());
		}

		return anythingPlaced;
	}

	/**
	 * @param {Vector} pos1
	 * @param {Vector} pos2
	 * @param {boolean} endHotizontal
	 * @returns {Array<{ tile: Vector, rotation: number }>}
	 * */
	#computeBuildPath(pos1, pos2, endHotizontal = true) {
		let result = [];

		// Place from start to corner
		const startTile = pos1;
		const endTile = pos2;

		const pathToCorner = this.#directionCorner(pos1, pos2, endHotizontal).sub(startTile);
		const deltaToCorner = pathToCorner.normalize().round();
		const lengthToCorner = Math.round(pathToCorner.length());
		let currentPos = startTile.copy();

		let rotation = (Math.round(Math.degrees(deltaToCorner.angle()) / 90) * 90 + 360) % 360;

		if (lengthToCorner > 0) {
			for (let i = 0; i < lengthToCorner; ++i) {
				result.push({
					tile: currentPos.copy(),
					rotation,
				});
				currentPos.addInplace(deltaToCorner);
			}
		}

		// Place from corner to end
		const pathFromCorner = endTile.sub(this.#directionCorner(pos1, pos2, endHotizontal));
		const deltaFromCorner = pathFromCorner.normalize().round();
		const lengthFromCorner = Math.round(pathFromCorner.length());

		if (lengthFromCorner > 0) {
			rotation = (Math.round(Math.degrees(deltaFromCorner.angle()) / 90) * 90 + 360) % 360;
			for (let i = 0; i < lengthFromCorner + 1; ++i) {
				result.push({
					tile: currentPos.copy(),
					rotation,
				});
				currentPos.addInplace(deltaFromCorner);
			}
		} else {
			// Finish last one
			result.push({
				tile: currentPos.copy(),
				rotation,
			});
		}
		return result;
	}

	/**
	 * @param {Vector} pos1
	 * @param {Vector} pos2
	 * @param {boolean} endHotizontal
	 * @returns {Vector|null}
	 */
	#directionCorner(pos1, pos2, endHotizontal = true) {
		// Figure which points the line visits
		const lastDragTile = pos1
		const mouseTile = pos2;

		if (endHotizontal) {
			return new Vector(lastDragTile.x, mouseTile.y);
		} else {
			return new Vector(mouseTile.x, lastDragTile.y);
		}
	}
}