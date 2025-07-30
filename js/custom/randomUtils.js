import { Vector } from "shapez/core/vector";
import { RotationCodes } from "../actions/descriptors/shapes/rotationCodes";

export class RandomUtils {

	/**
	 * @param {string} value
	 * @returns {string}
	 */
	static capitalizeFirst(value) {
		return String(value).charAt(0).toUpperCase() + String(value).slice(1);
	}

	/**
	 * @param {Vector} vector
	 * @returns {string}
	 */
	static formatVector(vector) {
		return `${vector.x}|${vector.y}`
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns {string}
	 */
	static formatPosition(x, y) {
		return `${x}|${y}`
	}

	/**
	 * @param {Vector} vector
	 * @param {("UP"|"DOWN"|"LEFT"|"RIGHT")} direction
	 * @param {number} ammount
	 * @returns {Vector}
	 */
	static vectorAddDir(vector, direction, ammount = 1) {
		switch (direction) {
			case "UP":
				vector.y = vector.y - ammount;
				break;
			case "DOWN":
				vector.y = vector.y + ammount;
				break;
			case "LEFT":
				vector.x = vector.x - ammount;
				break;
			case "RIGHT":
				vector.x = vector.x + ammount;
				break;
		}
		return vector;
	}

	/**
	 * @param {Vector} size
	 * @param {number} direction
	 * @returns {Vector}
	 */
	static directionalSize(size, direction) {
		const sizedDirection = new Vector();
		switch (direction) {
			case RotationCodes.getAngle("RIGHT"):
				sizedDirection.x = size.y;
				sizedDirection.y = size.x;
				break;
			case RotationCodes.getAngle("DOWN"):
				sizedDirection.x = -size.x;
				sizedDirection.y = size.y;
				break;
			case RotationCodes.getAngle("LEFT"):
				sizedDirection.x = -size.y;
				sizedDirection.y = -size.x;
				break;
			default:
				sizedDirection.x = size.x;
				sizedDirection.y = size.y;
		}

		return sizedDirection;
	}
}