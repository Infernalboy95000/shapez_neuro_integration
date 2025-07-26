import { ShapeCode } from "../shapes/shapeCode";

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
			msg = `Your goal shape is: ${shape}. ` +
				`You delivered ${this.#root.hubGoals.getCurrentGoalDelivered()} ` +
				`out of ${goal.required} required`;
		}

		return msg;
	}

	/** @returns {string} */
	describePinnedShapes() {
		// @ts-ignore A little SMH that typed.ts has not generated this
		const pinned = this.#root.hud.parts.pinnedShapes;
		let msg = `There's no shapes pinned.`;
		if (pinned.pinnedShapes.length > 0) {
			msg = `Pinned shapes:\r\n`;
			for (let i = 0; i < pinned.pinnedShapes.length; i++) {
				const shape = ShapeCode.describe(pinned.pinnedShapes[i]);
				const current = this.#root.hubGoals.getShapesStoredByKey(pinned.pinnedShapes[i]);
				const goal = pinned.findGoalValueForShape(pinned.pinnedShapes[i]);
				msg += `${shape}. Delivered: ${current} out of ${goal}`;
				if (i + 1 < pinned.pinnedShapes.length) {
					msg += `\r\n`;
				}
			}
		}

		return msg;
	}
}