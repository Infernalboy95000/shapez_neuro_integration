import { BaseActions } from "../baseActions";
import { MassDeleter } from "../executers/deleters/massDeleter";
import { SingleDeleter } from "../executers/deleters/singleDeleter";
import { DelList } from "../lists/inGame/deletionActionsList";

/** Manages all actions related to deletion. */
export class DeletionActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {SingleDeleter} */ #singleDeleter;
	/** @type {MassDeleter} */ #massDeleter;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(DelList.actions);
		super.addCallables(new Map([
			[DelList.deleteBuild, (e) => { return this.#tryDeleteBuilding(e)}],
			[DelList.deleteArea, (e) => { return this.#tryDeleteArea(e)}],
		]));

		this.#root = root;
		this.#singleDeleter = new SingleDeleter(root);
		this.#massDeleter = new MassDeleter(root);
	};

	activate() {
		const options = DelList.getOptions(this.#root);
		super.setOptions(options);
		super.activate();
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryDeleteBuilding(params) {
		return this.#singleDeleter.tryDeleteBuilding(
			params[DelList.xPos], params[DelList.yPos]
		);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryDeleteArea(params) {
		return this.#massDeleter.areaDelete(
			params[DelList.lowLeft_xPos], params[DelList.lowLeft_yPos],
			params[DelList.upRight_xPos], params[DelList.upRight_yPos]
		)
	}
}