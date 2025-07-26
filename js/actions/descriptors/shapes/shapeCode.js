import { RandomUtils } from "../../../custom/randomUtils";

export class ShapeCode {
	/**
	 * @param {string} code
	 * @returns {string}
	 * */
	static describe(code) {
		const color = this.#decodeColor(code);
		const shape = this.#decodeShape(code);

		if (shape == "") {
			return `[${code}]`;
		}
		else if (color == "") {
			return `${RandomUtils.capitalizeFirst(shape)} [${code}]`;
		}
		else {
			return `${RandomUtils.capitalizeFirst(color)} ${shape} [${code}]`;
		}
	}

	/**
	 * @param {string} code
	 * @returns {string}
	 * */
	static #decodeShape(code) {
		if (/^[C].[C].[C].[C].$/.test(code)) {
			return "circle";
		}
		else if (/^[R].[R].[R].[R].$/.test(code)) {
			return "square";
		}
		else if (/^[W].[W].[W].[W].$/.test(code)) {
			return "windmill";
		}
		else if (/^[R].[R].[R].[R].$/.test(code)) {
			return "star";
		}
		else {
			return "";
		}
	}

	/**
	 * @param {string} code
	 * @returns {string}
	 * */
	static #decodeColor(code) {
		if (/^.[u].[u].[u].[u]$/.test(code)) {
			return "uncolored";
		}
		else if (/^.[r].[r].[r].[r]$/.test(code)) {
			return "red";
		}
		else if (/^.[g].[g].[g].[g]$/.test(code)) {
			return "green";
		}
		else if (/^.[b].[b].[b].[b]$/.test(code)) {
			return "blue";
		}
		else if (/^.[y].[y].[y].[y]$/.test(code)) {
			return "yellow";
		}
		else if (/^.[p].[p].[p].[p]$/.test(code)) {
			return "purple";
		}
		else if (/^.[c].[c].[c].[c]$/.test(code)) {
			return "cyan";
		}
		else if (/^.[w].[w].[w].[w]$/.test(code)) {
			return "white";
		}
		else {
			return "";
		}
	}
}