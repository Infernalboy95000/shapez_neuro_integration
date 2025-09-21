import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { AreaSelector } from "../selectors/areaSelector";
import { HUDBlueprintPlacer } from "shapez/game/hud/parts/blueprint_placer";
import { formatBigNumber } from "shapez/core/utils";

/** Allows copying an entire area.*/
export class BlueprintCopier {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {AreaSelector} */ #areaSelector;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		this.#areaSelector = new AreaSelector(root);
	}

	/**
	 * @param {number} posX_1 @param {number} posY_1
	 * @param {number} posX_2 @param {number} posY_2
	 * @returns {{valid:boolean, msg:string}} */
	tryCopy(posX_1, posY_1, posX_2, posY_2) {
		const selection = this.#areaSelector.selectArea(posX_1, posY_1, posX_2, posY_2);
		const selSize = selection.size;

		if (selSize <= 0) {
			return {
				valid: false,
				msg: `No buildings selected.`
			};
		}

		this.#areaSelector.copySelected();
		if (!this.#root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_blueprints)) {
			return {
				valid: false,
				msg: "You cannot use this now."
			}
		}
		else {
			/** @type {HUDBlueprintPlacer} */ //@ts-ignore
			const blueprinter = this.#root.hud.parts.blueprintPlacer;
			const blueprint = blueprinter.currentBlueprint.get();
			const cost = blueprint.getCost();
			const ammount = this.#root.hubGoals.getShapesStoredByKey(this.#root.gameMode.getBlueprintShapeKey());
			const formatCost = formatBigNumber(cost);
			const formatAmmount = formatBigNumber(ammount);
			let result = `Successfully copied ${selSize} building${selSize == 1 ? "": "s"}.`;

			if (blueprint.canAfford(this.#root)) {
				result += ` It costs ${formatCost} blueprint piece${cost == 1 ? "" : "s"} to paste down. You have ${formatAmmount} blueprint piece${ammount == 1 ? "" : "s"}.`
			}
			else {
				result += ` However, it costs ${formatCost} blueprint piece${cost == 1 ? "" : "s"} to paste down, and you only have ${formatAmmount} blueprint piece${ammount == 1 ? "" : "s"}.`
			}

			return {
				valid: true,
				msg: result
			};
		}
	}
}