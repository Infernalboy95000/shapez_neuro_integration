import { BaseActions } from "../base/baseActions";
import { Dialog } from "shapez/core/modal_dialog_elements";
import { DialogActionList } from "../lists/dialogs/dialogActionList";
import { DialogDescriptor } from "../descriptors/dialogs/dialogDescriptor";
import { ClickDetector } from "shapez/core/click_detector";
import { Vector } from "shapez/core/vector";

export class DialogActions extends BaseActions {
	/** @type {import("../../main").NeuroIntegration} */ #mod
	/** @type {DialogDescriptor} */ #descriptor;
	/** @type {Dialog} */ #dialog;

	/** @param {import("../../main").NeuroIntegration} mod */
	constructor(mod) {
		super(DialogActionList.actions);
		super.addCallables(new Map([
			[DialogActionList.read, () => { return this.#read()}],
			[DialogActionList.accept, () => { return this.#accept()}],
		]));
		this.#mod = mod;
		this.#descriptor = new DialogDescriptor();
	};

	/** @param {Dialog} dialog */
	activateByDialog(dialog)
	{
		this.#dialog = dialog;
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

	/** @returns {{valid:boolean, msg:string}} */
	#accept()
	{
		const result = {valid:false, msg:"There's no dialog to close."}
		if (this.#dialog) {
			console.log(this.#dialog);
			/** @type {Array<ClickDetector>} */
			const clicks = this.#dialog.clickDetectors;
			console.log(clicks);
			for (let i = 0; i < clicks.length; i++)
			{
				clicks[i].handlerTouchStart(new MouseEvent("mousedown", {button:1}));
				clicks[i].handlerTouchEnd(new MouseEvent("mouseup", {button:1}));
			}
			result.valid = true;
			result.msg = "Dialog closed";
		}
		return result;
	}
}