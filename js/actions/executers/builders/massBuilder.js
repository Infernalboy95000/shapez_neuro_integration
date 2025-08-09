import { Vector } from "shapez/core/vector";
import { RandomUtils } from "../../../custom/randomUtils";
import { SingleBuilder } from "./singleBuilder";

/** Allows mass building operations */
export class MassBuilder {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {SingleBuilder} */ #singleBuilder;

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {SingleBuilder} singleBuilder
	 * */
	constructor(root, singleBuilder) {
		this.#root = root;
		this.#singleBuilder = singleBuilder;
	}

	/**
	 * @param {string} buildName
	 * @param {string} variant
	 * @param {string} rotName
	 * @param {number} posX
	 * @param {number} posY
	 * @param {("UP"|"DOWN"|"LEFT"|"RIGHT")} dir
	 * @param {number} lineLength
	 * @returns {{valid:boolean, msg:string}} */
	tryPlaceBuildingLine(buildName, variant, rotName, posX, posY, dir, lineLength) {
		let placedAll = true;
		let placedSome = false;
		let currentPos = new Vector(posX, posY);
		const result = this.#singleBuilder.trySelectAndRotate(
			buildName, variant, rotName
		);
		if (!result.valid) {
			return result;
		}

		this.#root.logic.performBulkOperation(() => {
			for (let i = 0; i < lineLength; i++) {
				const isPlaced = this.#singleBuilder.tryPlaceCurrentAt(
					currentPos.x, currentPos.y);

				if (isPlaced) {
					placedSome = true;
				}
				else {
					placedAll = false;
				}
				currentPos = RandomUtils.vectorAddDir(currentPos, dir);
			}
		})

		if (placedSome) {
			this.#singleBuilder.playPlacementSound(buildName);
		}
		
		if (placedAll) {
			result.msg = `Placed a line of ${buildName}s ` +
			`from x: ${posX}, y: ${posY} to x: ${currentPos.x}, y: ${currentPos.y}.`
		}
		else if (placedSome) {
			result.msg = `Partially placed a line of ${buildName}s ` +
			`from x: ${posX}, y: ${posY} to x: ${currentPos.x}, y: ${currentPos.y}. ` + 
			`There might be other buildings over there.`
		}
		else {
			result.msg = `Cannot place any ${buildName}s ` +
			`from x: ${posX}, y: ${posY} to x: ${currentPos.x}, y: ${currentPos.y}. ` +
			`It's probably full of other buildings over there.`
		}

		return result;
	}
}