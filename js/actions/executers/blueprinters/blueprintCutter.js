import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { AreaSelector } from "../selectors/areaSelector";
import { HUDBlueprintPlacer } from "shapez/game/hud/parts/blueprint_placer";
import { formatBigNumber } from "shapez/core/utils";

/** Allows cutting an entire area.*/
export class BlueprintCutter {
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
	tryCut(posX_1, posY_1, posX_2, posY_2) {
		const selection = this.#areaSelector.selectArea(posX_1, posY_1, posX_2, posY_2);
		const selSize = selection.size;

		if (selSize <= 0) {
			return {
				valid: false,
				msg: `No buildings selected.`
			};
		}

		this.#areaSelector.cutSelected();
		if (!this.#root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_blueprints)) {
			return {
				valid: false,
				msg: "You cannot use this now."
			}
		}
		else if (
			!this.#root.app.settings.getAllSettings().disableCutDeleteWarnings &&
			this.#areaSelector.isBig()
		) {
			return {
				valid: true,
				msg: "The command was sent, but, as the current dialog says, you need to confirm it."
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
			let result = `Successfully cutted ${selSize} building${selSize == 1 ? "": "s"}.`;

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