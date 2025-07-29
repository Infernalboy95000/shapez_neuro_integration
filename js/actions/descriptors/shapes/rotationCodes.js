/** Constains all allowed rotation angles for shapes. */
export class RotationCodes {
	static #codes = new Map([
		["UP", 0],
		["RIGHT", 90],
		["DOWN", 180],
		["LEFT", 270]
	])

	/**
	 * @param {string} direction
	 * @returns {Number}
	 * */
	static getAngle(direction) {
		if (RotationCodes.#codes.has(direction)) {
			return RotationCodes.#codes.get(direction);
		}
		else {
			return 0;
		}
	}

	/**
	 * @param {Number} angle
	 * @returns {string}
	 * */
	static getRotationName(angle) {
		let rotationName = "UP"
		RotationCodes.#codes.forEach((value, key) => {
			if (value == angle) {
				rotationName = key;
			}
		});
		return rotationName;
	}

	/**
	 * @param {string} direction
	 * @returns {boolean}
	 * */
	static isRotationValid(direction) {
		return RotationCodes.#codes.has(direction);
	}
}