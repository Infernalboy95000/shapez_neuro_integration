import { ClickDetector } from "shapez/core/click_detector";
import { Dialog } from "shapez/core/modal_dialog_elements";
import { DialogDescriptor } from "../../descriptors/dialogs/dialogDescriptor";

export class DialogController {
	/** @type {Dialog} */ #dialog;
	/** @type {HTMLInputElement} */ #input
	/** @type {Map<string, ClickDetector>} */ #buttons;
	/** @type {DialogDescriptor} */ #descriptor;

	constructor() {
		this.#descriptor = new DialogDescriptor();
	}

	/** @param {Dialog} dialog */
	inspect(dialog) {
		this.#dialog = dialog;
		this.#buttons = this.#mapOptions(dialog);
		this.#input = dialog.dialogElem.querySelector("input");
	}

	/** @returns {{has:boolean, min:number, max:number}} */
	hasInput() {
		const result = {has:false, min:0, max:0}
		if (this.#input)
		{
			result.has = true;
			result.min = this.#input.minLength;
			result.max = this.#input.maxLength;
		}
		return result;
	}

	/** @returns {Array<string>} */
	getActionKeys() {
		return Array.from(this.#buttons.keys());
	}

	/** @returns {string} */
	readInfo() {
		return this.#descriptor.describe(this.#dialog);
	}

	/**
	 * @param {string} request
	 * @returns {{valid:boolean, msg:string}}
	 * */
	tryExecuteAction(request) {
		const result = {valid:false, msg:"The option doesn't exist in the current dialog."}
		if (this.#buttons.has(request)) {
			const button = this.#buttons.get(request);
			button.handlerTouchStart(new MouseEvent("mousedown", {button:1}));
			button.handlerTouchEnd(new MouseEvent("mouseup", {button:1}));
			result.valid = true;
			result.msg = "Option executed.";
		}
		return result;
	}

	/**
	 * @param {string} inputText
	 * @returns {{valid:boolean, msg:string}}
	 * */
	tryInputText(inputText) {
		const result = {valid:false, msg:"This dialog has no text input."}
		if (this.hasInput()) {
			result.valid = true;
			this.#input.value = inputText;
			if (this.#input.value == inputText) {
				result.msg = "Text written correctly.";
			}
			else {
				result.msg = `Not all text could be written. Current text: ${this.#input.value}`;
			}
		}
		return result;
	}

	/**
	 * @param {Dialog} dialog
	 * @returns {Map<string, ClickDetector>}
	 * */
	#mapOptions(dialog) {
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
	 * @returns {HTMLInputElement}
	 * */
	#searchInputField(dialog) {
		return 
	}
}