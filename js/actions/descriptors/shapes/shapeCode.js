import { ShapeDefinition } from "shapez/game/shape_definition";
import { ColorCodes } from "./colorCodes";

export class ShapeCode {
	static #corners = ["top right", "bottom right", "bottom left", "top left"];
	static #halfs = ["right", "bottom", "left", "top"];
	static #quarters = ["top left", "top right", "bottom right", "bottom left"];

	/**
	 * @param {ShapeDefinition} shape
	 * @returns {string}
	 * */
	static describe(shape) {
		if (this.#isShapeTooComplex(shape))
			return `[${shape.getHash()}]`;

		let msg = "";
		for (let i = 0; i < shape.layers.length; i++) {
			msg += `${this.#describeLayer(shape.layers[i])}`;
			if (i + 1 < shape.layers.length)
				msg += " stacked with:\n";
		}
		return msg;
	}

	/**
	 * @param {any} layer
	 * @returns {string}
	 * */
	static #describeLayer(layer) {
		/** @type {Map<string, Array<Number>>} */
		const sameShapes = new Map();
		let msg = "";
		for (let i = 0; i < layer.length; i++) {
			if (layer[i] != null) {
				const shapeKey = `${layer[i].subShape}/${ColorCodes.describe(layer[i].color)}`;
				let shapeColor = [];
				if (sameShapes.has(shapeKey)) {
					shapeColor = sameShapes.get(shapeKey);
				}
				shapeColor.push(i);
				sameShapes.set(shapeKey, shapeColor);
			}
		}
		
		let current = 0;
		sameShapes.forEach((positions) => {
			const pos = positions[0];
			if (positions.length == 1) {
				msg += `${this.#corners[pos]} quarter ${ColorCodes.describe(layer[pos].color)} ${layer[pos].subShape.toLowerCase()}`;
			}
			else if (positions.length == 2) {
				if (positions[0] % 2 == positions[1] % 2)
					msg += `mirrored quarters ${this.#corners[positions[0]]} and ${this.#corners[positions[1]]} ${ColorCodes.describe(layer[pos].color)} ${layer[pos].subShape.toLowerCase()}`;
				else
					msg += `${this.#halfs[pos]} half ${ColorCodes.describe(layer[pos].color)} ${layer[pos].subShape.toLowerCase()}`;
			}
			else if (positions.length == 3) {
				msg += `three quarters ${ColorCodes.describe(layer[pos].color)} ${layer[pos].subShape.toLowerCase()} missing ${this.#quarters[pos]}`;
			}
			else {
				msg += `${ColorCodes.describe(layer[0].color)} ${layer[0].subShape.toLowerCase()}`;
			}
			current += 1;
			if (current < sameShapes.size)
				msg += " ";
		});
		return msg;
	}

	/**
	 * @param {ShapeDefinition} shape
	 * @returns {boolean}
	 * */
	static #isShapeTooComplex(shape) {
		if (shape.layers.length > 2 ||
			this.#countColors(shape) > 2 ||
			this.#countShapes(shape) > 2)
			return true;
	}

	/**
	 * @param {ShapeDefinition} shape
	 * @returns {Number}
	 * */
	static #countColors(shape) {
		let colors = [];
		for (let i = 0; i < shape.layers.length; i++) {
			for (let j = 0; j < shape.layers[i].length; j++) {
				if (shape.layers[i][j] && !colors.includes(shape.layers[i][j].color)) {
					colors.push(shape.layers[i][j].color);
				}
			}
		}
		return colors.length;
	}

	/**
	 * @param {ShapeDefinition} shape
	 * @returns {Number}
	 * */
	static #countShapes(shape) {
		let shapes = [];
		for (let i = 0; i < shape.layers.length; i++) {
			for (let j = 0; j < shape.layers[i].length; j++) {
				if (shape.layers[i][j] && !shapes.includes(shape.layers[i][j].shape)) {
					shapes.push(shape.layers[i][j].shape);
				}
			}
		}
		return shapes.length;
	}
}