import { Vector } from "shapez/core/vector";
import { RandomUtils } from "../../../custom/randomUtils";
import { SingleBuilder } from "./singleBuilder";

/** Allows mass building operations */
export class MassBuilder {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {SingleBuilder} */ #singleBuilder;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		this.#singleBuilder = new SingleBuilder(root);
	}

	/**
	 * @param {string} buildName
	 * @param {string} rotName
	 * @param {number} posX
	 * @param {number} posY
	 * @param {("UP"|"DOWN"|"LEFT"|"RIGHT")} dir
	 * @param {number} lineLength
	 * @returns {{valid:boolean, msg:string}} */
	tryPlaceBuildingLine(buildName, rotName, posX, posY, dir, lineLength) {
		let placedAll = true;
		let placedSome = false;
		let currentPos = new Vector(posX, posY);
		const result = this.#singleBuilder.trySelectAndRotate(buildName, rotName);
		if (!result.valid) {
			return result;
		}

		this.#root.logic.performBulkOperation(() => {
			for (let i = 0; i < lineLength; i++) {
				const msg = this.#singleBuilder.tryPlaceBuilding(
					buildName, rotName, posX, posY
				);

				if (!result.msg) {
					placedSome = true;
				}
				else {
					placedAll = false;
				}
				currentPos = RandomUtils.vectorAddDir(currentPos, dir);
			}
		})
		
		if (placedAll) {
			result.msg = `Placed a line of ${buildName}` +
			`from x: ${posX}, y: ${posY} to x: ${currentPos.x}, y: ${currentPos.y}.`
		}
		else if (placedSome) {
			result.msg = `Partially placed a line of ${buildName}` +
			`from x: ${posX}, y: ${posY} to x: ${currentPos.x}, y: ${currentPos.y}. ` + 
			`There might be other buildings over there.`
		}
		else {
			result.msg = `Cannot place any ${buildName}s` +
			`from x: ${posX}, y: ${posY} to x: ${currentPos.x}, y: ${currentPos.y}. ` +
			`It's probably full of other buildings over there.`
		}

		return result;
	}
}