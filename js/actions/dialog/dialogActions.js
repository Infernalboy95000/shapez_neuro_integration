import { BaseActions } from "../base/baseActions";
import { Dialog } from "shapez/core/modal_dialog_elements";
import { DialogActionList } from "../lists/dialogs/dialogActionList";
import { DialogDescriptor } from "../descriptors/dialogs/dialogDescriptor";
import { ClickDetector } from "shapez/core/click_detector";
import { T } from "shapez/translations";

export class DialogActions extends BaseActions {
	#bannedDialogs = [
		"dialog-Language"
	]

	/** @type {import("../../main").NeuroIntegration} */ #mod
	/** @type {DialogDescriptor} */ #descriptor;
	/** @type {Dialog} */ #dialog;
	/** @type {Map<string, ClickDetector>} */ #buttons;

	/** @param {import("../../main").NeuroIntegration} mod */
	constructor(mod) {
		super(DialogActionList.actions);
		super.addCallables(new Map([
			[DialogActionList.read, () => { return this.#read()}],
			[DialogActionList.chooseOption, (e) => { return this.#chooseOption(e)}],
		]));
		this.#mod = mod;
		this.#descriptor = new DialogDescriptor();
	};

	/** @param {Dialog} dialog */
	activateByDialog(dialog)
	{
		console.log(dialog);
		if (this.#isBannedDialog(dialog)) { return; }
		this.#dialog = dialog;
		this.#buttons = this.#mapOptions(dialog);
		super.setOptions(DialogActionList.getOptions(
			Array.from(this.#buttons.keys())
		));
		this.activate();
	}

	/** @returns {{valid:boolean, msg:string}} */
	#read()
	{
		const result = {valid:false, msg:"There's no dialog to read."}
		if (this.#dialog) {
			result.valid = true;
			result.msg = this.#descriptor.describe(this.#dialog);
		}
		return result;
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	 * */
	#chooseOption(params)
	{
		const requested = params[DialogActionList.option];
		const result = {valid:false, msg:"There's no dialog to close."}
		if (this.#dialog) {
			if (this.#buttons.has(requested)) {
				const button = this.#buttons.get(requested);
				button.handlerTouchStart(new MouseEvent("mousedown", {button:1}));
				button.handlerTouchEnd(new MouseEvent("mouseup", {button:1}));
				result.valid = true;
				result.msg = "Option executed";
			}
		}
		return result;
	}

	/**
	 * @param {Dialog} dialog
	 * @returns {Map<string, ClickDetector>}
	 * */
	#mapOptions(dialog)
	{
		const buttonsMap = new Map();

		/** @type {Array<ClickDetector>} */
		const clicks = dialog.clickDetectors;
		for (let i = 0; i < clicks.length; i++)
		{
			if (i == 0 && dialog.closeButton)
				buttonsMap.set("close", clicks[0]);
			else {
				const btName = clicks[i].element.innerText;
				buttonsMap.set(btName, clicks[i]);
			}
		}
		return buttonsMap;
	}

	/**
	 * @param {Dialog} dialog
	 * @returns {boolean}
	 * */
	#isBannedDialog(dialog)
	{
		const context = dialog.inputReciever.context;
		for (let i = 0; i < this.#bannedDialogs.length; i++)
		{
			if (this.#bannedDialogs[i] == context)
				return true;
		}
		return false;
	}
}