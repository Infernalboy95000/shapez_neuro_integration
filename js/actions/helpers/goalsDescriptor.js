import { ShapeCode } from "./shapeCode";

export class GoalsDescriptor {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/** @returns {string} */
	describeCurrentGoal() {
		const goal = this.#root.hubGoals.currentGoal;
		let msg = `There's no goal. ` +
			`Maybe you beated the game and reached freemode.`;
		
		if (goal) {
			const shape = ShapeCode.describe(goal.definition.cachedHash);
			msg = `Your goal shape is ${shape}. ` +
				`You delivered ${this.#root.hubGoals.getCurrentGoalDelivered()} ` +
				`out of ${goal.required} required`;
		}

		return msg;
	}
}