import { ShapeDefinition } from "shapez/game/shape_definition";
import { ShapeCode } from "../shapes/shapeCode";

export class GoalsDescriptor {
	static quadNames = ["Top right", "Bottom right", "Bottom left", "Top left"];

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @returns {string}
	 * */
	static describeCurrentGoal(root) {
		const goal = root.hubGoals.currentGoal;
		let msg = "";
		if (goal) {
			const shape = ShapeCode.describe(goal.definition);
			msg = `Your goal shape is: ${shape}. ` +
				`You delivered ${root.hubGoals.getCurrentGoalDelivered()} ` +
				`out of ${goal.required} required`;
		}

		return msg;
	}

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @returns {string}
	 * */
	static describePinnedShapes(root) {
		// @ts-ignore A little SMH that typed.ts has not generated this
		const pinned = root.hud.parts.pinnedShapes;
		let msg = "";
		console.log(pinned.pinnedShapes);
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

	/**
	 * @param {ShapeDefinition} shape
	 * @returns {string}
	 * */
	static fullyDescribeShape(shape) {
		let msg = `The shape with code ${shape.cachedHash} is composed of:\r\n`
		const layers = shape.layers;
		for (let i = layers.length - 1; i >= 0; --i) {
			msg += `Layer ${i + 1}:\r\n`;

			console.log(layers);
			for (let quad = 0; quad < layers[i].length; ++quad) {
				const contents = layers[i][quad];
				if (contents) {
					msg += `${this.quadNames[quad]} corner: ` +
					`${contents.color} ${contents.subShape}`;
				}
				else
					msg += `${this.quadNames[quad]} corner: empty.`
				if (quad + 1 < 4) { msg += "\r\n"; }
			}
		}

		return msg;
	}
}