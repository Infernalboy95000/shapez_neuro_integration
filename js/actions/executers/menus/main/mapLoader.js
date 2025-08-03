import { Mod } from "shapez/mods/mod";

export class MapLoader {
	/** @param {import("shapez/states/main_menu").MainMenuState} state */
	static newGame(state) {
		state.onPlayButtonClicked();
	}

	/** @param {import("shapez/states/main_menu").MainMenuState} state */
	static continueGame(state) {
		state.onContinueButtonClicked();
	}

	/**
	 * @param {Mod} mod
	 * @param {import("shapez/states/main_menu").MainMenuState} state
	 * @param {string} map
	 * @returns {boolean}
	 * */
	static tryLoadGame(mod, state, map) {
		const maps = this.#collectMaps(mod);
		if (maps.has(map)) {
			const mapID = maps.get(map);
			return this.tryLoadGameByID(mod, state, mapID);
		}
		return false;
	}

	/**
	 * @param {Mod} mod
	 * @param {import("shapez/states/main_menu").MainMenuState} state
	 * @param {string} mapID
	 * @returns {boolean}
	 * */
	static tryLoadGameByID(mod, state, mapID) {
		const data = mod.app.savegameMgr.getGameMetaDataByInternalId(mapID);
		if (data) {
			state.resumeGame(data);
			return true;
		}
		return false;
	}

	/**
	 * @param {Mod} mod
	 * @returns {Array<string>}
	 * */
	static getCurrentMaps(mod) {
		const maps = this.#collectMaps(mod);
		return Array.from(maps.keys());
	}

	/**
	 * @param {Mod} mod
	 * @returns {Map<string, string>}
	 * */
	static #collectMaps(mod) {
		const mappedMaps = new Map();
		const maps = mod.app.savegameMgr.getSavegamesMetaData();
		let unnamedMaps = 0;
		let duplicates = 2;
		
		for (let i = 0; i < maps.length; i++) {
			let originalName = maps[i].name;
			let mapName = maps[i].name;

			if (!mapName) {
				unnamedMaps++;
				mapName = `Unnamed map ${unnamedMaps}`;
			}

			while (mappedMaps.has(mapName)) {
				mapName = `${originalName} ${duplicates}`;
				duplicates++;
			}
			mappedMaps.set(mapName, maps[i].internalId);
		}
		return mappedMaps;
	}
}