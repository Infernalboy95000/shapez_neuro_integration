import { HUDPinnedShapes } from "shapez/game/hud/parts/pinned_shapes";
import { GoalsDescriptor } from "../../descriptors/pins/goalsDescriptor";
import { ShapeDefinition } from "shapez/game/shape_definition";

export class ShapesPinner {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/**
	 * @param {string} shapeCode
	 * @returns {{valid:boolean, msg:string}}
	 */
	tryPinShape(shapeCode) {
		const shape = this.#root.shapeDefinitionMgr.getShapeFromShortKey(shapeCode);
		const result = this.#isShapeValid(shape);
		if (!result.valid) { return result; }

		const currentGoalShape = this.#root.hubGoals.currentGoal.definition.getHash();
		if (shapeCode === currentGoalShape) {
			return {valid: false, msg: "Can not pin the current goal shape."};
		}

		if (shapeCode === this.#root.gameMode.getBlueprintShapeKey()) {
			return {valid: false, msg: "The blueprint shape is always pinned It can't be pinned it manually."};
		}
		/** @type {HUDPinnedShapes} */
		// @ts-ignore
		const pinned = this.#root.hud.parts.pinnedShapes;

		if (pinned.isShapePinned(shapeCode)) {
			return {valid: false, msg: "The shape is already pinned."};
		}

		this.#root.hud.signals.shapePinRequested.dispatch(shape);
		return {valid: true, msg: "Successfully pinned shape."};
	}

	/**
	 * @param {string} shapeCode
	 * @returns {{valid:boolean, msg:string}}
	 */
	tryUnpinShape(shapeCode) {
		const shape = this.#root.shapeDefinitionMgr.getShapeFromShortKey(shapeCode);
		const result = this.#isShapeValid(shape);
		if (!result.valid) { return result; }

		/** @type {HUDPinnedShapes} */
		// @ts-ignore
		const pinned = this.#root.hud.parts.pinnedShapes;

		if (pinned.isShapePinned(shapeCode)) {
			this.#root.hud.signals.shapeUnpinRequested.dispatch(shapeCode);
			result.valid = true;
			result.msg = "successfully unpinned shape.";
		}
		return result;
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

	/**
	 * @param {string} shapeCode
	 * @returns {{valid:boolean, msg:string}}
	 */
	fullyDescribeShape(shapeCode) {
		const shape = this.#root.shapeDefinitionMgr.getShapeFromShortKey(shapeCode);
		const result = this.#isShapeValid(shape);
		if (!result.valid) { return result; }
		// @ts-ignore
		this.#root.hud.parts.shapeViewer.renderForShape(shape);
		result.msg = GoalsDescriptor.fullyDescribeShape(shape);
		return result;
	}

	/**
	 * @param {ShapeDefinition} shape
	 * @returns {{valid:boolean, msg:string}}
	 * */
	#isShapeValid(shape) {
		if (!shape) {
			return {valid: false, msg: "The shape is invalid."};
		}

		if (shape.isEntirelyEmpty()) {
			return {valid: false, msg: "You can't pin an empty shape."};
		}

		return {valid: true, msg: ""};
	}
}