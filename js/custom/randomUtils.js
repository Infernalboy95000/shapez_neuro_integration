import { Vector } from "shapez/core/vector";

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
	 * @param {Array<number>} vector
	 * @param {("UP"|"DOWN"|"LEFT"|"RIGHT")} direction
	 * @param {number} ammount
	 * @returns {Array<number>}
	 */
	static vectorAddDir(vector, direction, ammount = 1) {
		switch (direction) {
			case "UP":
				vector[1] = vector[1] - ammount;
				break;
			case "DOWN":
				vector[1] = vector[1] + ammount;
				break;
			case "LEFT":
				vector[0] = vector[0] - ammount;
				break;
			case "RIGHT":
				vector[0] = vector[0] + ammount;
				break;
		}
		return vector;
	}
}