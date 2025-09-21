import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { HUDBlueprintPlacer } from "shapez/game/hud/parts/blueprint_placer";
import { RotationCodes } from "../../descriptors/shapes/rotationCodes";
import { Blueprint } from "shapez/game/blueprint";
import { Vector } from "shapez/core/vector";
import { enumMouseButton } from "shapez/game/camera";
import { formatBigNumber } from "shapez/core/utils";

/** Allows pasting a selected blueprint.*/
export class BlueprintPaster {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/**
	 * @param {number} posX @param {number} posY
	 * @param {string} rotName
	 * @returns {{valid:boolean, msg:string}} */
	tryPaste(posX, posY, rotName) {
		if (!this.#root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_blueprints)) {
			return {
				valid: false,
				msg: "You cannot use this now."
			}
		}

		/** @type {HUDBlueprintPlacer} */ //@ts-ignore
		const blueprinter = this.#root.hud.parts.blueprintPlacer;

		/** @type {Blueprint} */
		const blueprint = blueprinter.currentBlueprint.get();
		const piecesAmmount = this.#root.hubGoals.getShapesStoredByKey(this.#root.gameMode.getBlueprintShapeKey());

		if (blueprint == null) {
			return {
				valid: false,
				msg: `You have no blueprint to paste down.`
			};
		}

		if (!blueprinter.getHasFreeCopyPaste() && !blueprint.canAfford(this.#root)) {
			const cost = blueprint.getCost();
			const formatCost = formatBigNumber(cost);
			const formatAmmount = formatBigNumber(piecesAmmount);
			return {
				valid: false,
				msg: `You cannot afford to paste down the blueprint. It costs ${formatCost} blueprint piece${cost == 1 ? "" : "s"} to paste down, and you only have ${formatAmmount} blueprint piece${piecesAmmount == 1 ? "" : "s"}.`
			};
		}

		if (blueprinter.lastBlueprintUsed.layer !== this.#root.currentLayer) {
			return {
				valid: false,
				msg: "You tried to blueprint from a different layer. This is not allowed."
			};
		}

		if (!RotationCodes.isRotationValid(rotName)) {
			rotName == "up";
		}
		const rotCodes = RotationCodes.getCodes();
		let rotations = 0;

		for (let i = 0; i < rotCodes.length; i++) {
			if (rotCodes[i] == rotName) {
				rotations = i + 1;
			}
		}

		for (let i = 0; i < rotations; i++) {
			blueprinter.currentBlueprint.get().rotateCw();
		}

		blueprinter.onMouseDown(new Vector(posX, posY).toWorldSpace(), enumMouseButton.left);
		const newAmmount = this.#root.hubGoals.getShapesStoredByKey(this.#root.gameMode.getBlueprintShapeKey());

		if (!blueprinter.getHasFreeCopyPaste() && piecesAmmount == newAmmount) {
			return {
				valid: false,
				msg: "Couldn't place any piece of the blueprint. There's probably a lot of buildings already there."
			};
		}

		return {
			valid: true,
			msg: "Blueprint successfully pasted."
		};
	}
}