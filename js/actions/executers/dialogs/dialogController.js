import { ClickDetector } from "shapez/core/click_detector";
import { Dialog } from "shapez/core/modal_dialog_elements";
import { DialogDescriptor } from "../../descriptors/dialogs/dialogDescriptor";

export class DialogController {
	/** @type {Dialog} */ #dialog;
	/** @type {{buttons:Map<string, ClickDetector>, signals:Map<string, ClickDetector>, text:HTMLInputElement, close:ClickDetector}} */ #inputs;
	/** @type {DialogDescriptor} */ #descriptor;

	constructor() {
		this.#descriptor = new DialogDescriptor();
	}

	/**
	 * @param {Dialog} dialog
	 * @returns {{
	 * 		buttons:Array<string>,
	 * 		signals:Array<string>,
	 * 		text:{has:boolean, min:number, max:number},
	 * 		close:boolean
	 * }}
	 * */
	inspect(dialog) {
		const result = {buttons:[], signals:[], text:{has:false, min:1, max:9}, close:false};
		this.#dialog = dialog;
		this.#inputs = this.#descriptor.mapInputs(dialog);

		if (this.#inputs.buttons.size > 0)
			result.buttons = Array.from(this.#inputs.buttons.keys());
		
		if (this.#inputs.signals.size > 0)
			result.signals = Array.from(this.#inputs.signals.keys());
		
		if (this.#inputs.text) {
			result.text.has = true;
			result.text.min = this.#inputs.text.minLength;
			result.text.max = this.#inputs.text.maxLength;
		}

		if (this.#inputs.close)
			result.close = true;

		return result;
	}

	/** @returns {string} */
	readInfo() {
		let message = this.#descriptor.describe(this.#dialog);
		if (this.#inputs.text)
		{
			if (this.#inputs.text.value == "")
				message += `It's input field is empty`;
			else
				message += `It's input field has '${this.#inputs.text.value}' written on it.`;
		}

		return message;
	}

	/**
	 * @param {string} buttonName
	 * @returns {{valid:boolean, msg:string}}
	 * */
	tryPressButton(buttonName) {
		const result = {valid:false, msg:"The button doesn't exist in the current window."}
		if (this.#inputs.buttons.has(buttonName)) {
			this.#pressButton(this.#inputs.buttons.get(buttonName));
			result.valid = true;
			result.msg = "Button pressed.";
		}
		return result;
	}

	/**
	 * @param {string} signalName
	 * @returns {{valid:boolean, msg:string}}
	 * */
	trySetSignal(signalName) {
		const result = {valid:false, msg:"The signal is not predefined in the current window."}
		if (this.#inputs.signals.has(signalName)) {
			this.#pressButton(this.#inputs.signals.get(signalName));
			result.valid = true;
			result.msg = "Signal set.";
		}
		return result;
	}

	/**
	 * @param {string} inputText
	 * @returns {{valid:boolean, msg:string}}
	 * */
	tryInputText(inputText) {
		const result = {valid:false, msg:"This window has no text input."}
		if (this.#inputs.text) {
			result.valid = true;
			this.#inputs.text.value = inputText;
			if (this.#inputs.text.value == inputText) {
				result.msg = "Text written correctly.";
			}
			else {
				result.msg = `Not all text could be written. Current text: ${this.#inputs.text.value}`;
			}
		}
		return result;
	}

	/** @returns {{valid:boolean, msg:string}} */
	tryClose() {
		const result = {valid:false, msg:"This window has no proper close button."}
		if (this.#inputs.close) {
			this.#pressButton(this.#inputs.close);
			result.valid = true;
			result.msg = "Window closed.";
		}
		return result;
	}

	/** @param {ClickDetector} button */
	#pressButton(button) {
		button.handlerTouchStart(new MouseEvent("mousedown", {button:1}));
		button.handlerTouchEnd(new MouseEvent("mouseup", {button:1}));
	}
}