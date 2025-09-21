import { T } from "shapez/translations";

export class ColorCodes {
	/**
	 * @param {string} colorName
	 * @returns {string}
	 * */
	static describe(colorName) {
		return T.ingame.colors[colorName].toLowerCase();
	}
}