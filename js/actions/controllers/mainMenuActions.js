import { SdkClient } from "../../sdkClient";
import { SettingsMenu } from "../../settings/settingsMenu";
import { EnumSchema } from "../definitions/schema/enumSchema";
import { ActionList } from "../lists/actionList";
import { MainMenuActionList } from "../lists/mainMenuActionList";
import { MapLoader } from "../executers/mapLoader";
import { StatusDisplay } from "../../visuals/statusDisplay";

export class MainMenuActions {
	/** @type {import("shapez/states/main_menu").MainMenuState} */ #state;
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {Map<string, string>} */ #mapsAvailable = new Map();
	/** @type {StatusDisplay} */ #StatusDisplay;
	/** @type {MapLoader} */ #MapLoader;
	/** @type {ActionList} */ #actions;

	/** @param {import("shapez/mods/mod").Mod} mod */
	constructor(mod) {
		this.#mod = mod;
		this.#StatusDisplay = new StatusDisplay();
		this.#MapLoader = new MapLoader(mod);
		this.#actions = new ActionList();
	}

	/** @param {import("shapez/states/main_menu").MainMenuState} state */
	menuOpenned(state) {
		this.#state = state;
		const statusDisplayBox = this.#createStatusBox();
		this.#StatusDisplay.show(statusDisplayBox);

		if (SdkClient.isConnected()) {
			this.#onConnectedActions();
		}
		else if (this.#mod.settings.autoConnect) {
			SdkClient.connected.add(() => this.#onConnectedActions());
			if (!SdkClient.isAttempting()) {
				this.#StatusDisplay.setText(
					"Connecting...", "attempting"
				);
				SdkClient.tryConnect(this.#mod.settings.socketURL);
			}
		}
	}

	menuClosed() {
		this.#actions.deactivateActions();
	}

	playerSentAction(action) {
		if (this.#tryPlayMap(action)) {
			SdkClient.tellActionResult(
				action.id, true,
				`The map is loading. ` +
				`Please, wait. This usually takes an instant.`
			)
		}
		else {
			SdkClient.tellActionResult(
				action.id, false,
				`Error loading the map requested`
			)
		}
	}

	#onConnectedActions() {
		this.#actions.removeAllActions();
		this.#tryOpenGame();
		this.#actions.activateActions();
	}

	#tryOpenGame() {
		if (this.#mod.settings.forceOpenMap) {
			this.#MapLoader.forceChosenMap(this.#state);
		}
		else if (this.#mod.settings.playerChooseMap) {
			this.#tellPlayerMapOptions();
		}
	}

	/**
	 * @param {object} action
	 * @returns {boolean}
	 */
	#tryPlayMap(action) {
		if (action.name == MainMenuActionList.PLAY_GAME.getName()) {
			const availableMap = this.#mod.settings.mapAvailable;
			if (availableMap ==  MainMenuActionList.CONTINUE_GAME.getName()) {
				return this.#MapLoader.tryContinueLastMap(this.#state);
			}
			else if (availableMap ==  MainMenuActionList.NEW_GAME.getName()) {
				return this.#MapLoader.tryCreateNewMap(this.#state);
			}
			else {
				return this.#MapLoader.tryOpenMapByID(availableMap, this.#state);
			}
		}
		else if (action.name ==  MainMenuActionList.CONTINUE_GAME.getName()) {
			return this.#MapLoader.tryContinueLastMap(this.#state);
		}
		else if (action.name ==  MainMenuActionList.NEW_GAME.getName()) {
			return this.#MapLoader.tryCreateNewMap(this.#state);
		}
		else if (this.#mapsAvailable.has(action.params.map)) {
			const mapID = this.#mapsAvailable.get(action.params.map);
			return this.#MapLoader.tryOpenMapByID(mapID, this.#state);
		}
		else {
			return false;
		}
	}

	#tellPlayerMapOptions() {
		const options = this.#MapLoader.getAvailableOptions();

		if (options.length <= 1) {
			this.#actions.addAction(MainMenuActionList.PLAY_GAME);
		}
		else {
			this.#mapsAvailable.clear();
			let unnamedMaps = 0;
			let duplicates = 2;

			for (let i = 0; i < options.length; i++) {
				switch (options[i]) {
					case SettingsMenu.NEW_MAP:
						this.#actions.addAction(MainMenuActionList.NEW_GAME);
						break;
					case SettingsMenu.LAST_MAP:
						this.#actions.addAction(MainMenuActionList.CONTINUE_GAME);
						break;
					default:
						const metaData = this.#mod.app.savegameMgr.getGameMetaDataByInternalId(options[i]);
						let originalName = metaData.name;
						let mapName = metaData.name;

						if (!mapName) {
							unnamedMaps++;
							mapName = `Unnamed map ${unnamedMaps}`;
						}

						while (this.#mapsAvailable.has(mapName)) {
							mapName = `${originalName} ${duplicates}`;
							duplicates++;
						}
						this.#mapsAvailable.set(mapName, metaData.internalId);
						break;
				}
			}

			if (this.#mapsAvailable.size > 0) {
				const maps = Array.from(this.#mapsAvailable.keys());
				const mapsSchema = new EnumSchema("map", maps);
				MainMenuActionList.LOAD_GAME.setOptions([mapsSchema])
				this.#actions.addAction(MainMenuActionList.LOAD_GAME);
			}
		}
	}

	/** @returns {HTMLDivElement} */
	#createStatusBox() {
		const parent = document.querySelector(".sideContainer");
		const statusDisplay = document.createElement("div");
		statusDisplay.className = "sdkStatusDisplay";
		parent.appendChild(statusDisplay);

		const header = document.createElement("div");
		header.className = "header";
		statusDisplay.appendChild(header);

		const title = document.createElement("h3");
		title.textContent = "Sdk Status";
		header.appendChild(title);

		return statusDisplay;
	}
}