import { Dialog } from "shapez/core/modal_dialog_elements";

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
	 * @param {string} HTML
	 * @returns {string}
	 */
	#scrapeWallOfText(HTML) {
		return HTML.replace(/<button class="website[^<]*<\/button>/gm,'')
			.replace(/<[^\/]*[>]/g,'\n')
			.replace(/<[^>]*>/g,'');
	}
}