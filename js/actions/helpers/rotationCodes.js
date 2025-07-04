export class RotationCodes {
	/**
	 * @param {string} direction
	 * @returns {Number}
	 * */
	static getAngle(direction) {
		const rotations = this.#getRotationsMap();
		if (rotations.has(direction)) {
			return rotations.get(direction);
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
		const rotations = this.#getRotationsMap();
		rotations.forEach((value, key) => {
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
		const rotations = this.#getRotationsMap();
		return rotations.has(direction);
	}

	/** @returns {Map<string, number>} */
	static #getRotationsMap() {
		const map = new Map();
		map.set("UP", 0);
		map.set("RIGHT", 90);
		map.set("DOWN", 180);
		map.set("LEFT", 270);
		return map;
	}
}