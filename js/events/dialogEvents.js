import { HUDModalDialogs } from "shapez/game/hud/parts/modal_dialogs";
import { ActionEvent } from "../custom/actionEvent";
import { ActionsCollection } from "../actions/base/actionsCollection";
import { DialogActions } from "../actions/dialog/dialogActions";
import { Dialog } from "shapez/core/modal_dialog_elements";

export class DialogEvents {
	/** @type {ActionEvent} */ static DIALOG_CLOSED = new ActionEvent();
	/** @type {DialogActions} */ #dialogActions;

	/** @param {import("../main").NeuroIntegration} mod */
	constructor(mod) {
		this.#dialogActions = new DialogActions(mod);
		ActionsCollection.addActions(new Map([
			["dialog", this.#dialogActions]
		]));
		const thisClass = this;

		mod.modInterface.runAfterMethod( HUDModalDialogs, "internalShowDialog",
			function(dialog) { thisClass.#onDialogOpenned(dialog); }
		);

		mod.modInterface.runBeforeMethod( HUDModalDialogs, "closeDialog",
			function(_) { thisClass.#onDialogClosed(); }
		);
	}

	/** @param {Dialog} dialog */
	#onDialogOpenned(dialog) {
		ActionsCollection.deactivateAllActive();
		this.#dialogActions.activateByDialog(dialog);
	}

	#onDialogClosed() {
		ActionsCollection.deactivateActions(["dialog"]);
		DialogEvents.DIALOG_CLOSED.invoke();
	}
}