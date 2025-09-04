import { BaseActions } from "../base/baseActions";
import { SingleDeleter } from "../executers/deleters/singleDeleter";
import { DeletionActionList } from "../lists/inGame/deletionActionsList";

/** Manages actions related to deletion. */
export class DeletionActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {SingleDeleter} */ #singleDeleter;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(DeletionActionList.actions);
		super.addCallables(new Map([
			[DeletionActionList.deleteBuild, (e) => { return this.#tryDeleteBuilding(e)}],
		]));

		this.#root = root;
		this.#singleDeleter = new SingleDeleter(root);
	};

	activate() {
		const options = DeletionActionList.getOptions(this.#root);
		super.setOptions(options);
		super.activate();
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryDeleteBuilding(params) {
		return this.#singleDeleter.tryDeleteBuilding(
			params[DeletionActionList.xPos], params[DeletionActionList.yPos]
		);
	}
}