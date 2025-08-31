import { ClickDetector } from "shapez/core/click_detector";
import { Dialog, DialogWithForm } from "shapez/core/modal_dialog_elements";
import { BaseItem } from "shapez/game/base_item";
import { SignalDescriptor } from "../signals/signalDescriptor";
import { FormElementInput, FormElementItemChooser } from "shapez/core/modal_dialog_forms";

export class DialogDescriptor {
	constructor() {};

	/**
	 * @param {Dialog} dialog
	 * @returns {string}
	 * */
	describe(dialog) {
		const htmlString = dialog.dialogElem.querySelector(".content").innerHTML;
		const msg = `${dialog.title}\n` +
		`${this.#scrapeWallOfText(htmlString)}`;

		return msg;
	}

		/**
	 * @param {Dialog} dialog
	 * @returns {{
	 *		buttons:Map<string, ClickDetector>,
	 *		signals:Map<string, ClickDetector>,
	 *		text:HTMLInputElement
	 *		close:ClickDetector
	 * }}
	 */
	mapInputs(dialog) {
		const result = {
			buttons:new Map(), signals:new Map(), text:null, close:null
		}

		/** @type {Array<ClickDetector>} */
		const clicks = dialog.clickDetectors;

		/** @type {{signals:Array<BaseItem>, text:HTMLInputElement}} */
		let forms;
		
		let currentSignal = 0;

		if (dialog instanceof DialogWithForm) {
			forms = this.#mapForms(dialog);

			if (forms.text)
				result.text = forms.text;
		}

		for (let i = 0; i < clicks.length; i++) {
			if (i == 0 && dialog.closeButton)
				result.close = clicks[0];
			else {
				const element = clicks[i].element;
				if (element instanceof HTMLCanvasElement) {
					const desc = SignalDescriptor.Describe(forms.signals[currentSignal]);
					currentSignal += 1;
					result.signals.set(desc, clicks[i]);
				}
				else if (element instanceof HTMLButtonElement) {
					const nodeName = element.childNodes[0].nodeValue;
					result.buttons.set(nodeName, clicks[i]);
				}
			}
		}
		return result;
	}

	/**
	 * @param {DialogWithForm} dialogForm
	 * @returns {{signals:Array<BaseItem>, text:HTMLInputElement}}
	 * */
	#mapForms(dialogForm) {
		const result = {signals:[], text:null}
		const forms = dialogForm.formElements;
		for (let i = 0; i < forms.length; i++) {
			if (forms[i] instanceof FormElementItemChooser) {
				// @ts-ignore
				for (let j = 0; j < forms[i].items.length; j++) {
					// @ts-ignore
					result.signals.push(forms[i].items[j]); 
				}
			}
			else if (forms[i] instanceof FormElementInput) {
				// @ts-ignore
				result.text = forms[i].element;
			}
		}
		return result;
	}

	/**
	 * @param {string} HTML
	 * @returns {string}
	 */
	#scrapeWallOfText(HTML) {
		if (HTML.includes('<button class="website', 0)) {
			return HTML.replace(/<button class="website[^<]*<\/button>/gm,'')
			.replace(/<[^\/]*[>]/g,'\n')
			.replace(/<[^>]*>/g,'')
			.replace(/(\n){2,}/g,'\n');
		}
		else {
			return HTML.replace(/<button class="website[^<]*<\/button>/gm,'')
			.replace(/<[^>]*>/g,'')
			.replace(/( ){2,}/g,'')
			.replace(/(\n){2,}/g,'\n');
		}
	}
}