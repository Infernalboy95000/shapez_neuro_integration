import { BaseActions } from "../base/baseActions";
import { Dialog } from "shapez/core/modal_dialog_elements";
import { DialogActionList } from "../lists/dialogs/dialogActionList";
import { DialogController } from "../executers/dialogs/dialogController";

export class DialogActions extends BaseActions {
	#bannedDialogs = ["dialog-Language"]

	/** @type {import("../../main").NeuroIntegration} */ #mod
	/** @type {DialogController} */ #controller;

	/** @param {import("../../main").NeuroIntegration} mod */
	constructor(mod) {
		super(DialogActionList.actions);
		super.addCallables(new Map([
			[DialogActionList.read, () => { return this.#read()}],
			[DialogActionList.chooseOption, (e) => { return this.#tryChooseOption(e)}],
			[DialogActionList.writeText, (e) => { return this.#tryWriteText(e)}],
		]));
		this.#mod = mod;
		this.#controller = new DialogController();
	};

	/** @param {Dialog} dialog */
	activateByDialog(dialog) {
		console.log(dialog);
		if (this.#isBannedDialog(dialog)) { return; }
		this.#controller.inspect(dialog);
		super.setOptions(DialogActionList.getOptions(
			this.#controller.getActionKeys()
		));
		const actions = [DialogActionList.read, DialogActionList.chooseOption]
		if (this.#controller.hasInput())
			actions.push(DialogActionList.writeText);
		this.activate(actions);
	}

	/** @returns {{valid:boolean, msg:string}} */
	#read() {
		return {
			valid:true,
			msg:this.#controller.readInfo()
		}
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	 * */
	#tryChooseOption(params) {
		const requested = params[DialogActionList.option];
		return this.#controller.tryExecuteAction(requested);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	 * */
	#tryWriteText(params) {
		const text = params[DialogActionList.text];
		return this.#controller.tryInputText(text);
	}

	/**
	 * @param {Dialog} dialog
	 * @returns {boolean}
	 * */
	#isBannedDialog(dialog) {
		const context = dialog.inputReciever.context;
		for (let i = 0; i < this.#bannedDialogs.length; i++) {
			if (this.#bannedDialogs[i] == context)
				return true;
		}
		return false;
	}
}