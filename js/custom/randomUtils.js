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
}