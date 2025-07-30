/** Constains all allowed rotation angles for shapes. */
export class RotationCodes {
	static #codes = new Map([
		["UP", 0],
		["RIGHT", 90],
		["DOWN", 180],
		["LEFT", 270]
	])

	static #directions = new Map([
		["top", this.#codes.get("UP")],
		["right", this.#codes.get("RIGHT")],
		["bottom", this.#codes.get("DOWN")],
		["left", this.#codes.get("LEFT")],
	])

	/**
	 * @param {string} direction
	 * @returns {Number}
	 * */
	static getAngle(direction) {
		if (this.#codes.has(direction)) {
			return this.#codes.get(direction);
		}
		else if (this.#directions.has(direction)) {
			return this.#directions.get(direction);
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
		let rotationName = "UP";
		this.#codes.forEach((value, key) => {
			if (value == angle) {
				rotationName = key;
			}
		});
		return rotationName;
	}

	/**
	 * @param {Number} angle
	 * @returns {string}
	 * */
	static getDirectionName(angle) {
		let directionName = "top";
		this.#directions.forEach((value, key) => {
			if (value == angle) {
				directionName = key;
			}
		});
		return directionName;
	}

	/**
	 * @param {string} direction
	 * @returns {boolean}
	 * */
	static isRotationValid(direction) {
		return this.#codes.has(direction);
	}
}