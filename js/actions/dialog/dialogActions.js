import { BaseActions } from "../base/baseActions";
import { Dialog } from "shapez/core/modal_dialog_elements";
import { DialogActionList } from "../lists/dialogs/dialogActionList";
import { DialogController } from "../executers/dialogs/dialogController";
import { ModSettings } from "../../modSettings";

export class DialogActions extends BaseActions {
	#bannedDialogs = ["dialog-Language"]

	/** @type {import("../../main").NeuroIntegration} */ #mod
	/** @type {DialogController} */ #controller;

	/** @param {import("../../main").NeuroIntegration} mod */
	constructor(mod) {
		super(DialogActionList.actions);
		super.addCallables(new Map([
			[DialogActionList.read, () => { return this.#read()}],
			[DialogActionList.pressButton, (e) => { return this.#tryPressButton(e)}],
			[DialogActionList.setSignal, (e) => { return this.#trySetSignal(e)}],
			[DialogActionList.writeText, (e) => { return this.#tryWriteText(e)}],
			[DialogActionList.closeWindow, () => { return this.#tryCloseWindow()}],
		]));
		this.#mod = mod;
		this.#controller = new DialogController();
	};

	/** @param {Dialog} dialog */
	activateByDialog(dialog) {
		if (this.#isBannedDialog(dialog)) { return; }
		const inputs = this.#controller.inspect(dialog);
		super.setOptions(DialogActionList.getOptions(
			inputs.buttons, inputs.signals, inputs.text.min, inputs.text.max
		));

		const actions = [];
		if (ModSettings.get(ModSettings.KEYS.descriptiveActions))
			actions.push(DialogActionList.read);

		if (inputs.buttons.length > 0)
			actions.push(DialogActionList.pressButton);

		if (inputs.signals.length > 0)
			actions.push(DialogActionList.setSignal);

		if (inputs.text.has)
			actions.push(DialogActionList.writeText);

		if (inputs.close)
			actions.push(DialogActionList.closeWindow);

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
	#tryPressButton(params) {
		const requested = params[DialogActionList.button];
		return this.#controller.tryPressButton(requested);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	 * */
	#trySetSignal(params) {
		const requested = params[DialogActionList.signal];
		return this.#controller.trySetSignal(requested);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	 * */
	#tryWriteText(params) {
		const text = params[DialogActionList.text];
		return this.#controller.tryInputText(text);
	}

	/** @returns {{valid:boolean, msg:string}} */
	#tryCloseWindow() {
		return this.#controller.tryClose();
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