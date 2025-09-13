export class ModSettings {
	static KEYS = {
		socketURL: "socketURL",
		coordsGrid: "coordsGrid",
		autoConnect: "autoConnect",
		hideURL: "hideURL",
		playerChooseMap: "playerChooseMap",
		forceOpenMap: "forceOpenMap",
		descriptiveActions: "descriptiveActions",
		forcedMapTime: "forcedMapTime",
		mapAvailable: "mapAvailable",
		waitAfterHumanTime: "waitAfterHumanTime",
	}

	static #defaultValues = {
		[this.KEYS.socketURL]: "localhost:8000",
		[this.KEYS.coordsGrid]: false,
		[this.KEYS.autoConnect]: false,
		[this.KEYS.hideURL]: true,
		[this.KEYS.playerChooseMap]: false,
		[this.KEYS.forceOpenMap]: false,
		[this.KEYS.descriptiveActions]: true,
		[this.KEYS.forcedMapTime]: 5,
		[this.KEYS.mapAvailable] : "any_map",
		[this.KEYS.waitAfterHumanTime]: 5
	}
	/** @type {import("shapez/mods/mod").Mod}*/ static #mod;

	/** @param {import("shapez/mods/mod").Mod} mod */
	static defaults(mod) {
		this.#mod = mod;
		for (let [key, value] of Object.entries(this.#defaultValues)) {
			if (mod.settings[key] == undefined)
				this.set(key, value);
		}
		this.save();
	}

	/** @param {string} key @param {any} value */
	static set(key, value) {
		this.#mod.settings[key] = value;
	}

	/** @param {string} key @returns {any}*/
	static get(key) {
		return this.#mod.settings[key];
	}
	
	static save() {
		this.#mod.saveSettings();
	}
}