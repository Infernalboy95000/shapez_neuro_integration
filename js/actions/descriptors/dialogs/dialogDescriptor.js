import { Dialog } from "shapez/core/modal_dialog_elements";

export class DialogDescriptor {
	constructor() {};

	/**
	 * @param {Dialog} dialog
	 * @returns {string}
	 * */
	describe(dialog) {
		const htmlString = dialog.dialogElem.querySelector(".content").textContent;
		const msg = `${dialog.title}\n` +
		`${htmlString}`;

		return msg;
	}
}