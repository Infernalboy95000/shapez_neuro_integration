import { GameRoot } from "shapez/game/root";
import { ShapeCode } from "../shapes/shapeCode";

export class GoalsDescriptor {
	/**
	 * @param {GameRoot} root
	 * @returns {string}
	 * */
	static describeCurrentGoal(root) {
		const goal = root.hubGoals.currentGoal;
		let msg = "";
		if (goal) {
			const shape = ShapeCode.describe(goal.definition.cachedHash);
			msg = `Your goal shape is: ${shape}. ` +
				`You delivered ${root.hubGoals.getCurrentGoalDelivered()} ` +
				`out of ${goal.required} required`;
		}

		return msg;
	}

	/**
	 * @param {GameRoot} root
	 * @returns {string}
	 * */
	static describePinnedShapes(root) {
		// @ts-ignore A little SMH that typed.ts has not generated this
		const pinned = root.hud.parts.pinnedShapes;
		let msg = "";
		if (pinned.pinnedShapes.length > 0) {
			msg = `Pinned shapes:\r\n`;
			for (let i = 0; i < pinned.pinnedShapes.length; i++) {
				const shape = ShapeCode.describe(pinned.pinnedShapes[i]);
				const current = root.hubGoals.getShapesStoredByKey(pinned.pinnedShapes[i]);
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