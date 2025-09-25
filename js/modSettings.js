export class ModSettings {
	static KEYS = {
		// connection //
		socketURL: "socketURL",
		hideURL: "hideURL",
		// context //
		coordsGrid: "coordsGrid",
		descriptiveActions: "descriptiveActions",
		waitAfterHumanTime: "waitAfterHumanTime",
		// startup //
		autoConnect: "autoConnect",
		playerChooseMap: "playerChooseMap",
		forceOpenMap: "forceOpenMap",
		forcedMapTime: "forcedMapTime",
		mapAvailable: "mapAvailable",
		// dangerous //
		allowPause: "allowPause",
		allowExit: "allowExit",
		allowClose: "allowClose"
	}

	static #defaultValues = {
		// connection //
		[this.KEYS.hideURL]: false,
		[this.KEYS.socketURL]: "localhost:8000",
		// context //
		[this.KEYS.coordsGrid]: false,
		[this.KEYS.descriptiveActions]: true,
		[this.KEYS.waitAfterHumanTime]: 5,
		// startup //
		[this.KEYS.autoConnect]: false,
		[this.KEYS.playerChooseMap]: false,
		[this.KEYS.forceOpenMap]: false,
		[this.KEYS.forcedMapTime]: 5,
		[this.KEYS.mapAvailable]: "any_map",
		// dangerous //
		[this.KEYS.allowPause]: true,
		[this.KEYS.allowExit]: false,
		[this.KEYS.allowClose]: false,
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