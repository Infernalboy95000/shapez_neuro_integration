import { BaseActions } from "../base/baseActions";
import { GoalsDescriptor } from "../descriptors/pins/goalsDescriptor";
import { ShapesPinner } from "../executers/pinners/shapesPinner";
import { PinnedActionsList } from "../lists/inGame/pinnedActionsList";

export class PinnedActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ShapesPinner} */ #shapesPinner;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(PinnedActionsList.actions);
		super.addCallables(new Map([
			[PinnedActionsList.goal, () => { return this.#describeGoalShape()}],
			[PinnedActionsList.pinned, () => { return this.#describePinnedShapes()}],
			[PinnedActionsList.shapeInfo, (e) => { return this.#tryFullyDescribeShape(e)}],
			[PinnedActionsList.unpinShape, (e) => { return this.#tryUnpinShape(e)}],
		]));

		this.#root = root;
		this.#shapesPinner = new ShapesPinner(root);
	};

	activate() {
		const compile = GoalsDescriptor.compileInfo(this.#root);
		const options = PinnedActionsList.getOptions(
			compile.unpin, compile.goal
		);
		super.setOptions(options);
		const actions = [PinnedActionsList.goal, PinnedActionsList.shapeInfo];
		if (compile.unpin.length > 0) {
			actions.push(PinnedActionsList.pinned);
			actions.push(PinnedActionsList.unpinShape);
		}
		super.activate(actions);
	}

	/** @returns {{valid:boolean, msg:string}} */
	#describeGoalShape() {
		return this.#shapesPinner.describeGoalShape();
	}

	/** @returns {{valid:boolean, msg:string}} */
	#describePinnedShapes() {
		return this.#shapesPinner.describePinnedShapes();
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryFullyDescribeShape(params) {
		return this.#shapesPinner.fullyDescribeShape(params[PinnedActionsList.shape]);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryUnpinShape(params) {
		return this.#shapesPinner.tryUnpinShape(params[PinnedActionsList.shapeToUnpin]);
	}
}