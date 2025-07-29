import { GoalsDescriptor } from "../../descriptors/pins/goalsDescriptor";

export class ShapesPinner {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/** @returns {{valid:boolean, msg:string}} */
	describeGoalShape() {
		const result = {valid:false, msg:"There's no main goal."}
		const msg = GoalsDescriptor.describeCurrentGoal(this.#root);
		if (msg != "") {
			result.valid = true;
			result.msg = msg;
		}
		return result;
	}

	/** @returns {{valid:boolean, msg:string}} */
	describePinnedShapes() {
		const result = {valid:false, msg:"You have no shapes pinned."}
		const msg = GoalsDescriptor.describePinnedShapes(this.#root);
		if (msg != "") {
			result.valid = true;
			result.msg = msg;
		}
		return result;
	}
}