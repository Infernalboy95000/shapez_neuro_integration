import { ModSettings } from "../../modSettings";
import { BaseActions } from "../base/baseActions";
import { MainExtraActioner } from "../executers/menus/main/mainExtraActioner";
import { MainExtrasActionList } from "../lists/mainMenu/mainExtrasActionList";

export class MainExtrasActions extends BaseActions {
	/** @type {MainExtraActioner} */ #actioner;

	/**
	 * @param {import("shapez/states/main_menu").MainMenuState} state
	 * */
	constructor(state) {
		super(MainExtrasActionList.actions);
		super.addCallables(new Map([
			[MainExtrasActionList.closeGame, () => { return this.#closeGame()}],
		]));

		this.#actioner = new MainExtraActioner(state);
	};

	activate() {
		const actions = ["NULL"];
		const close = ModSettings.get(ModSettings.KEYS.allowClose);
		if (close) {
			actions.push(MainExtrasActionList.closeGame);
		}

		super.activate(actions);
	}

	/** @returns {{valid:boolean, msg:string}} */
	#closeGame() {
		this.#actioner.closeGame();
		return {valid:true, msg:"Closing the game. See you soon."};
	}
}