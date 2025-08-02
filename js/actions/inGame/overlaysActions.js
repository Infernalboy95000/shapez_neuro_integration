import { InGameState } from "shapez/states/ingame";
import { BaseActions } from "../baseActions";
import { OverlaysActionList } from "../lists/inGame/overlaysActionList";
import { TestShop } from "../descriptors/overlays/testShop";
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
		return TestShop.test(this.#root);
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