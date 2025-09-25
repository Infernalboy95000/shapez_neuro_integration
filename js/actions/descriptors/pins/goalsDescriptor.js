import { ShapeDefinition } from "shapez/game/shape_definition";
import { ShapeCode } from "../shapes/shapeCode";
import { ColorCodes } from "../shapes/colorCodes";
import { T } from "shapez/translations";
import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { formatBigNumber } from "shapez/core/utils";

export class GoalsDescriptor {
	static quadNames = ["Top right", "Bottom right", "Bottom left", "Top left"];

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @returns {{boosts:Array<string>, full:Array<string>, pin:Array<string>, unpin:Array<string>, goal:string, blueprint:string}}
	 * */
	static compileInfo(root) {
		const compile = { boosts:["all"], full:[], pin:[], unpin: [], goal:"", blueprint:""};
		const upgrades = root.gameMode.getUpgrades();
		const currentGoalShape = root.hubGoals.currentGoal.definition.getHash();
		compile.goal = currentGoalShape;
		for (const [id, _] of Object.entries(upgrades)) {
			compile.boosts.push(T.shopUpgrades[id].name);
			const tiers = upgrades[id];
			const tier = root.hubGoals.getUpgradeLevel(id);
			const tierHandle = tiers[tier];
			let full = true;
			tierHandle.required.forEach(({ shape, amount }) => {
				const have = root.hubGoals.getShapesStoredByKey(shape);
				if (currentGoalShape != shape) {
					// @ts-ignore
					if (root.hud.parts.pinnedShapes.isShapePinned(shape)) {
						compile.unpin.push(shape);
					}
					else {
						compile.pin.push(shape);
					}
				}

				if (have < amount) {
					full = false;
				}
			});

			if (full) {
				compile.full.push(T.shopUpgrades[id].name)
			}
		}
		if (root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_blueprints)) {
			compile.blueprint = root.gameMode.getBlueprintShapeKey();
		}
		return compile;
	}

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
				`You delivered ${formatBigNumber(root.hubGoals.getCurrentGoalDelivered())} ` +
				`out of ${formatBigNumber(goal.required)} required`;
		}

		return msg;
	}

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @returns {string}
	 * */
	static describeBlueprintShape(root) {
		const blueprintKey = root.gameMode.getBlueprintShapeKey();
		const definition = ShapeDefinition.fromShortKey(blueprintKey);
		let msg = "";
		if (root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_blueprints)) {
			const shape = ShapeCode.describe(definition);
			msg = `The blueprint shape is: ${shape}. ` +
				`You have ${formatBigNumber(root.hubGoals.getShapesStoredByKey(blueprintKey))} `;
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
		if (pinned.pinnedShapes.length > 0) {
			msg = `Pinned shapes:\r\n`;
			for (let i = 0; i < pinned.pinnedShapes.length; i++) {
				const shape = ShapeCode.describe(pinned.pinnedShapes[i]);
				const current = root.hubGoals.getShapesStoredByKey(pinned.pinnedShapes[i]);
				const goal = pinned.findGoalValueForShape(pinned.pinnedShapes[i]);
				msg += `${shape}. Delivered: ${formatBigNumber(current)} out of ${formatBigNumber(goal)}`;
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
			for (let quad = 0; quad < layers[i].length; ++quad) {
				const contents = layers[i][quad];
				if (contents) {
					msg += `${this.quadNames[quad]} corner: ` +
					`${ColorCodes.describe(contents.color)} ${contents.subShape}`;
				}
				else
					msg += `${this.quadNames[quad]} corner: empty.`
				if (quad + 1 < 4) { msg += "\r\n"; }
			}
		}

		return msg;
	}
}