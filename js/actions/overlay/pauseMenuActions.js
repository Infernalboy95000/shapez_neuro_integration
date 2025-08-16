import { BaseActions } from "../base/baseActions";
import { PauseMenuDescriptor } from "../descriptors/overlays/pauseMenuDescriptor";
import { PauseMenuActionList } from "../lists/overlays/pauseMenuActionList";

export class PauseMenuActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {PauseMenuDescriptor} */ #pauseDescriptor;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(PauseMenuActionList.actions);
		super.addCallables(new Map([
			[PauseMenuActionList.info, () => { return this.#getInfo()}],
			[PauseMenuActionList.resume, () => { return this.#resumeGame()}],
			[PauseMenuActionList.exit, () => { return this.#exit()}],
		]));

		this.#root = root;
		this.#pauseDescriptor = new PauseMenuDescriptor(root);
	};

	/** @returns {{valid:boolean, msg:string}} */
	#getInfo() {
		return {valid: true, msg: this.#pauseDescriptor.describe()};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#resumeGame() {
		this.#root.hud.parts.settingsMenu.close();
		return {valid: true, msg: "Game resumed."};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#exit() {
		this.#root.hud.parts.settingsMenu.returnToMenu();
		return {valid: true, msg: "Returning to main menu."};
	}
}