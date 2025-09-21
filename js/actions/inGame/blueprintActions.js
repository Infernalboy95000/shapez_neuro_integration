import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { BaseActions } from "../base/baseActions";
import { BlueprintCopier } from "../executers/blueprinters/blueprintCopier";
import { BlueprintCutter } from "../executers/blueprinters/blueprintCutter";
import { BlueprintPaster } from "../executers/blueprinters/blueprintPaster";
import { BlueprintActionList } from "../lists/inGame/blueprintActionList";
import { BlueprintInfo } from "../executers/blueprinters/blueprintInfo";
import { formatBigNumber } from "shapez/core/utils";

/** Manages all mass delete actions. */
export class BlueprintActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {BlueprintCopier} */ #copier;
	/** @type {BlueprintCutter} */ #cutter;
	/** @type {BlueprintPaster} */ #paster;
	/** @type {BlueprintInfo} */ #info;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(BlueprintActionList.actions);
		super.addCallables(new Map([
			[BlueprintActionList.copyArea, (e) => { return this.#tryCopyArea(e)}],
			[BlueprintActionList.cutArea, (e) => { return this.#tryCutArea(e)}],
			[BlueprintActionList.pasteBlueprint, (e) => { return this.#tryPasteBlueprint(e)}],
			[BlueprintActionList.getBlueprintCost, (e) => { return this.#getBlueprintCost()}],
			[BlueprintActionList.clearBlueprint, (e) => { return this.#clearBlueprint()}],
		]));

		this.#root = root;
		this.#copier = new BlueprintCopier(this.#root);
		this.#cutter = new BlueprintCutter(this.#root);
		this.#paster = new BlueprintPaster(this.#root);
		this.#info = new BlueprintInfo(this.#root);
	};

	activate() {
		if (!this.#root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_blueprints))
			return;

		const actions = [];
		if (this.#info.has()) {
			actions.push(BlueprintActionList.pasteBlueprint);
			actions.push(BlueprintActionList.getBlueprintCost);
			actions.push(BlueprintActionList.clearBlueprint);
		}
		else {
			actions.push(BlueprintActionList.copyArea);
			actions.push(BlueprintActionList.cutArea);
		}

		super.setOptions(BlueprintActionList.getOptions());
		super.activate(actions);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryCopyArea(params) {
		return this.#copier.tryCopy(
			params[BlueprintActionList.lowLeft_xPos], params[BlueprintActionList.lowLeft_yPos],
			params[BlueprintActionList.upRight_xPos], params[BlueprintActionList.upRight_yPos]
		)
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryCutArea(params) {
		return this.#cutter.tryCut(
			params[BlueprintActionList.lowLeft_xPos], params[BlueprintActionList.lowLeft_yPos],
			params[BlueprintActionList.upRight_xPos], params[BlueprintActionList.upRight_yPos]
		)
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryPasteBlueprint(params) {
		return this.#paster.tryPaste(
			params[BlueprintActionList.xPos], params[BlueprintActionList.yPos],
			params[BlueprintActionList.rot]
		)
	}

	/** @returns {{valid:boolean, msg:string}} */
	#getBlueprintCost() {
		const cost = this.#info.getCost();
		if (cost < 0) {
			return {valid:false, msg:"You have no blueprint to paste down."}
		}
		else {
			const ammount = this.#root.hubGoals.getShapesStoredByKey(this.#root.gameMode.getBlueprintShapeKey());
			const formatCost = formatBigNumber(cost);
			const formatAmmount = formatBigNumber(ammount);

			let result = "";
			if (ammount >= cost) {
				result = `The current blueprint costs ${formatCost} blueprint piece${cost == 1 ? "" : "s"} to paste down, and you have ${formatAmmount} blueprint piece${ammount == 1 ? "" : "s"}.`;
			}
			else {
				const ammount = this.#root.hubGoals.getShapesStoredByKey(this.#root.gameMode.getBlueprintShapeKey());
				result = `The current blueprint costs ${formatCost} blueprint piece${cost == 1 ? "" : "s"} to paste down. But, you have only ${formatAmmount} blueprint piece${ammount == 1 ? "" : "s"}.`;
			}
			return {valid:true, msg:result};
		}
	}

	/** @returns {{valid:boolean, msg:string}} */
	#clearBlueprint() {
		const result = {valid:false, msg:""};
		result.valid = this.#info.clear();
		if (result.valid) {
			result.msg = "Cleared blueprint.";
		}
		else {
			result.msg = "No blueprint to clear";
		}
		return result;
	}
}