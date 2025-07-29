import { Vector } from "shapez/core/vector";
import { SingleBuilder } from "./singleBuilder";
import { ToolbeltSelector } from "../selectors/toolbeltSelector";

/** Allows operating the Belt Planner. Only allowed for belts. */
export class BeltPlannerBuilder {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {SingleBuilder} */ #singleBuilder;
	/** @type {ToolbeltSelector} */ #toolbelt;

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {SingleBuilder} singleBuilder
	 */
	constructor(root, singleBuilder) {
		this.#root = root;
		this.#singleBuilder = singleBuilder;
		this.toolbelt = new ToolbeltSelector(root);
	}

	/**
	 * @param {number} posX1 @param {number} posY1
	 * @param {number} posX2 @param {number} posY2
	 * @param {boolean} endHotizontal
	 * @returns {{valid:boolean, msg:string}}
	 * */
	buildPlan(posX1, posY1, posX2, posY2, endHotizontal = true) {
		let placedAll = true;
		let placedSome = false;

		// @ts-ignore
		const result = this.#toolbelt.trySelectBuilding("belt");
		if (!result.valid) {
			return result;
		}

		// Get path to place
		const path = this.#computeBuildPath(
			new Vector(posX1, posY1), new Vector(posX2, posY2), endHotizontal
		);

		// Perform this in bulk to avoid recalculations
		this.#root.logic.performBulkOperation(() => {
			for (let i = 0; i < path.length; ++i) {
				const { rotation, tile } = path[i];
				this.#root.hud.parts.buildingPlacer.currentBaseRotation = rotation;
				if (this.#root.hud.parts.buildingPlacer.tryPlaceCurrentBuildingAt(tile)) {
					placedSome = true;
				}
				else {
					placedAll = false;
				}
			}
		});

		if (placedSome) {
			this.#singleBuilder.playPlacementSound("belt");
		}

		result.valid = placedSome;
		if (placedAll) {
			result.msg = "Fully placed belt plan.";
		}
		else if (placedSome) {
			result.msg = "Partially placed belt plan. There might be other buildings over there.";
		}
		else {
			result.msg = "Belt plan failed! It's probably full of other buildings over there.";
		}
		return result;
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

		// @ts-ignore
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
			// @ts-ignore
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