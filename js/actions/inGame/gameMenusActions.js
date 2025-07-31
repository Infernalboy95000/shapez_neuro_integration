import { InGameState } from "shapez/states/ingame";
import { BaseActions } from "../baseActions";
import { GameMenusActionList } from "../lists/inGame/gameMenusActionList";
export class GameMenusActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {InGameState} */ #state;

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {InGameState} state
	 * */
	constructor(root, state) {
		super(GameMenusActionList.actions);
		super.addCallables(new Map([
			[GameMenusActionList.openUpgrades,
				() => { return this.#openUpgradesMenu()}],
			[GameMenusActionList.openStats,
				() => { return this.#openStatsMenu()}],
			[GameMenusActionList.saveGame,
				() => { return this.#saveGame()}],
			[GameMenusActionList.pauseGame,
				() => { return this.#pauseGame()}],
		]));

		this.#root = root;
		this.#state = state;
	};

	/** @returns {{valid:boolean, msg:string}} */
	#openUpgradesMenu() {
		this.#root.hud.parts.shop.show();
		return {valid:true, msg:"openned the upgrades menu"};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#openStatsMenu() {
		this.#root.hud.parts.statistics.show();
		return {valid:true, msg:"openned stats menu"};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#saveGame() {
		this.#state.doSave();
		return {valid:true, msg:"saving the game..."};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#pauseGame() {
		this.#root.hud.parts.settingsMenu.show();
		return {valid:true, msg:"game paused."};
	}
}