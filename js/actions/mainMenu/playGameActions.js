import { ModSettings } from "../../modSettings";
import { SettingsMenu } from "../../settings/settingsMenu";
import { BaseActions } from "../base/baseActions";
import { MapLoader } from "../executers/menus/main/mapLoader";
import { PlayGameActionList } from "../lists/mainMenu/PlayGameActionList";

export class PlayGameActions extends BaseActions {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/states/main_menu").MainMenuState} */ #state

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/states/main_menu").MainMenuState} state
	 * */
	constructor(mod, state) {
		super(PlayGameActionList.actions);
		super.addCallables(new Map([
			[PlayGameActionList.playGame,
				(e) => { return this.#playGame()}],
			[PlayGameActionList.newGame,
				(e) => { return this.#newGame()}],
			[PlayGameActionList.continueGame,
				(e) => { return this.#continueGame()}],
			[PlayGameActionList.loadGame,
				(e) => { return this.#tryLoadMap(e)}],
		]));

		this.#mod = mod;
		this.#state = state;
	};

	activate() {
		const actions = this.#getAvailableActions();
		if (actions.maps.length > 0) {
			const options = PlayGameActionList.getOptions(actions.maps);
			super.setOptions(options);
		}
		super.activate(actions.actions);
	}

	forcePlayMap() {
		this.#playGame();
	}

	/** @returns {{valid:boolean, msg:string}} */
	#playGame() {
		return this.#playGameOption();
	}

	/** @returns {{valid:boolean, msg:string}} */
	#newGame() {
		MapLoader.newGame(this.#state);
		return {valid: true, msg: "Creating a new map."};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#continueGame() {
		MapLoader.continueGame(this.#state);
		return {valid: true, msg: "Loading last played map."};
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryLoadMap(params) {
		const result = {valid: true, msg: "Loading map."};
		result.valid = MapLoader.tryLoadGame(this.#mod, this.#state,
			params[PlayGameActionList.map]
		);

		if (!result.valid) {
			result.msg = `There's no map called ` +
			`${params[PlayGameActionList.map]}`;
		}
		return result;
	}

	/**
	 * @param {string} mapID
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryLoadMapByID(mapID) {
		const result = {valid: true, msg: "Loading map."};
		if (!MapLoader.tryLoadGameByID(this.#mod, this.#state, mapID)) {
			result.valid = false;
			result.msg = `Couldn't load the map set in settings. ` +
			`Someone  other than you messed up.`
		}
		return result;
	}

	/** @returns {{actions:Array<string>, maps:Array<string>}} */
	#getAvailableActions() {
		const actions = [];
		let maps = [];
		const allowedMap = ModSettings.get(ModSettings.KEYS.mapAvailable);
		const saves = MapLoader.getCurrentMaps(this.#mod);

		if (saves.length <= 1) {
			actions.push(PlayGameActionList.playGame);
		}
		else if (allowedMap == SettingsMenu.ANY_MAP) {
			actions.push(PlayGameActionList.loadGame);
			maps = saves;
		}
		else if (allowedMap == SettingsMenu.ANY_OPTION) {
			actions.push(PlayGameActionList.newGame);
			actions.push(PlayGameActionList.loadGame);
			actions.push(PlayGameActionList.continueGame);
			maps = saves;
		}
		else {
			actions.push(PlayGameActionList.playGame);
		}

		return {actions:actions, maps:maps};
	}

	/** @returns {{valid:boolean, msg:string}} */
	#playGameOption() {
		const options = [];
		const allowedMap = ModSettings.get(ModSettings.KEYS.mapAvailable);
		const saves = MapLoader.getCurrentMaps(this.#mod);

		if (saves.length <= 0 || allowedMap == SettingsMenu.NEW_MAP) {
			options.push(() => {
				ModSettings.set(ModSettings.KEYS.mapAvailable, SettingsMenu.LAST_MAP);
				return this.#newGame();
			});
		}
		else if (allowedMap == SettingsMenu.LAST_MAP) {
			options.push(() => {return this.#continueGame()});
		}
		else if (
			allowedMap == SettingsMenu.ANY_MAP ||
			allowedMap == SettingsMenu.ANY_OPTION
		) {
			for (let i = 0; i < saves.length; i++) {
				options.push(() => {return this.#tryLoadMap({
					[PlayGameActionList.map]:saves[i]
				})});
			}

			if (allowedMap == SettingsMenu.ANY_OPTION) {
				options.push(() => {return this.#newGame()});
				if (saves.length > 0) {
					options.push(() => {return this.#continueGame()});
				}
			}
		}
		else {
			options.push(() => this.#tryLoadMapByID(allowedMap));
		}
		const random = Math.floor(Math.random() * options.length);
		return options[random]();
	}
}