import { BaseActions } from "../base/baseActions";
import { MassDeleter } from "../executers/deleters/massDeleter";
import { MassDeleteActionList } from "../lists/inGame/massDeleteActionList";


/** Manages all mass delete actions. */
export class MassDeleteActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {MassDeleter} */ #massDeleter;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(MassDeleteActionList.actions);
		super.addCallables(new Map([
			[MassDeleteActionList.deleteArea, (e) => { return this.#tryDeleteArea(e)}],
		]));

		this.#root = root;
		this.#massDeleter = new MassDeleter(root);
	};

	activate() {
		const options = MassDeleteActionList.getOptions(this.#root);
		super.setOptions(options);
		super.activate();
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryDeleteArea(params) {
		return this.#massDeleter.areaDelete(
			params[MassDeleteActionList.lowLeft_xPos], params[MassDeleteActionList.lowLeft_yPos],
			params[MassDeleteActionList.upRight_xPos], params[MassDeleteActionList.upRight_yPos]
		)
	}
}