import { InGameState } from "shapez/states/ingame";
import { BaseActions } from "../base/baseActions";
import { OverlaysActionList } from "../lists/inGame/overlaysActionList";

export class OverlaysActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {InGameState} */ #state;

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {InGameState} state
	 * */
	constructor(root, state) {
		super(OverlaysActionList.actions);
		super.addCallables(new Map([
			[OverlaysActionList.openUpgrades,
				() => { return this.#openUpgradesMenu()}],
			[OverlaysActionList.openStats,
				() => { return this.#openStatsMenu()}],
			[OverlaysActionList.saveGame,
				() => { return this.#saveGame()}],
			[OverlaysActionList.pauseGame,
				() => { return this.#pauseGame()}],
		]));

		this.#root = root;
		this.#state = state;
	};

	/** @returns {{valid:boolean, msg:string}} */
	#openUpgradesMenu() {
		// @ts-ignore
		this.#root.hud.parts.shop.show();
		return {valid:true, msg:"openned upgrades menu"};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#openStatsMenu() {
		// @ts-ignore
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