import { BaseActions } from "../base/baseActions";
import { ShapesPinner } from "../executers/pinners/shapesPinner";
import { PinList } from "../lists/inGame/pinnedActionsList";

export class PinnedActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ShapesPinner} */ #shapesPinner;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(PinList.actions);
		super.addCallables(new Map([
			[PinList.goal, (e) => { return this.#describeGoalShape(e)}],
			[PinList.pinned, (e) => { return this.#describePinnedShapes(e)}],
		]));

		this.#root = root;
		this.#shapesPinner = new ShapesPinner(root);
	};

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#describeGoalShape(params) {
		return this.#shapesPinner.describeGoalShape();
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#describePinnedShapes(params) {
		return this.#shapesPinner.describePinnedShapes();
	}
}