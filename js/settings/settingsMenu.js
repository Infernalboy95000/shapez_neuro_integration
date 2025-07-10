import { SOUNDS	} from "shapez/platform/sound";
import { SettingCategory } from "./settingsCategory";
import { ToggleSetting } from "./inputs/toggleSetting";
import { TextSetting } from "./inputs/textSetting";
import { ConnectionSettings } from "./connectionSettings";
import { ContextSettings } from "./contextSettings";
import { StartupSettings } from "./startupSettings";
import { ButtonSetting } from "./inputs/buttonSetting";
import { OptionListSetting } from "./inputs/optionListSetting";

export class SettingsMenu {
	static ANY_MAP = "any_map";
	static ANY_OPTION = "any_option";
	static NEW_MAP = "new_map";
	static LAST_MAP = "last_map";

	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {HTMLDivElement} */ #menu;
	/** @type {HTMLButtonElement} */ #button;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 */
	constructor(mod) {
		this.#mod = mod;
	}

	showMenu() {
		this.#buildMenu();
	}

	#buildMenu() {
		this.#menu = document.createElement("div");
		this.#menu.classList.add("category");
		this.#menu.setAttribute("data-category", "neuroSdk");
		this.#createSettings();

		const parent = document.querySelector(".sidebar");
		const otherBlock = document.querySelector(".other");
		const container	= document.querySelector(".categoryContainer");
		container.appendChild(this.#menu);

		this.#createButton();
		parent.insertBefore(this.#button, otherBlock);
	}

	#createButton() {
		this.#button = document.createElement("button");
		this.#button.classList.add("styledButton", "categoryButton");
		this.#button.setAttribute("data-category-btn", "neuroSdk");
		this.#button.innerText = "Nuero SDK";
		this.#setButtonEvents();
	}

	#setButtonEvents() {
		this.#button.addEventListener("click", () => 
			this.#onButtonClicked()
		);

		this.#button.addEventListener("mousedown", () =>
			this.#onButtonMouseDown()
		);

		this.#button.addEventListener("mouseup", () => 
			this.#onButtonMouseUp()
		);
	}

	#onButtonClicked() {
		const previousCategory = document.querySelector(".category.active");
		const previousCategoryButton = document.querySelector(".categoryButton.active");

		previousCategory.classList.remove("active");
		previousCategoryButton.classList.remove("active");

		this.#button.classList.add("active")
		this.#menu.classList.add("active");
	}

	#onButtonMouseDown() {
		this.#button.classList.add("selected");
		this.#mod.app.sound.playUiSound(SOUNDS.uiClick);
	}

	#onButtonMouseUp() {
		this.#button.classList.remove("selected");
	}

	#createSettings() {
		this.#connextionSettings();
		this.#contextSettings();
		this.#startupSettings();
	}

	#connextionSettings() {
		new SettingCategory(this.#menu, "Player connection", true);
		const connSettings = new ConnectionSettings(this.#mod);

		connSettings.addSdkButton(new ButtonSetting(
			this.#mod, this.#menu,
			"SDK integration",
			"Connect the SDK integration to your player",
			"Connect",
			ButtonSetting.Style.DEFAULT,
			"sdkStatus"
		));

		connSettings.addSdkURL(new TextSetting (
			this.#mod, this.#menu,
			"SDK URL",
			"The URL the SDK will use next time is connected",
			"sdkURL",
			"text",
			this.#mod.settings.socketURL,
			256
		));
	}

	#contextSettings() {
		new SettingCategory(this.#menu, "SDK Context");
		const contextSettings = new ContextSettings(this.#mod);

		contextSettings.addCorodsGridToogle(new ToggleSetting (
			this.#mod, this.#menu,
			"Coordinates grid",
			"Shows every tile's x/y position. Maybe usefull when using external vision.",
			"sdkCoordsGrid"
		));
	}

	#startupSettings() {
		new SettingCategory(this.#menu, "Startup");

		const startupSettngs = new StartupSettings(this.#mod);

		startupSettngs.addAutoConnectToogle(new ToggleSetting (
			this.#mod, this.#menu,
			"Auto connect to player",
			"Attempts to connect to the player when launching the game",
			"sdkPlayerAutoConnect"
		));

		startupSettngs.addPlayerChooseMapToggle(new ToggleSetting (
			this.#mod, this.#menu,
			"Player can choose map",
			"Allows the player to start a map. This can be limited to certain maps.",
			"sdkPlayerChooseMap"
		));

		startupSettngs.addForceOpenMapToggle(new ToggleSetting (
			this.#mod, this.#menu,
			"Force open map",
			"Opens a map when entering the main menu. This can be limited to certain maps.",
			"sdkForceOpenMap"
		));

		const mapOptions = this.#getMapOptions();
		
		startupSettngs.addMapAvailableOptions(new OptionListSetting(
			this.#mod, this.#menu,
			"Map to open",
			"Which map will be allowed to be open by the player or forced to open. " +
			"After selecting and creating a new map, this will set to continue it after",
			mapOptions, this.#mod.settings.mapAvailable, "any_map",
			"sdkMapAvailable",
		));
	}

	/** @return {Map} */
	#getMapOptions() {
		const mapOptions = new Map();
		mapOptions.set(SettingsMenu.ANY_MAP, "Any map");
		mapOptions.set(SettingsMenu.ANY_OPTION, "Any option");
		mapOptions.set(SettingsMenu.NEW_MAP, "New Map");
		mapOptions.set(SettingsMenu.LAST_MAP, "Continue");
		const saves = this.#mod.app.savegameMgr.getSavegamesMetaData();
		let unnamedMaps = 0;

		for (let i = 0; i < saves.length; i++) {
			let mapName = saves[i].name;

			if (!mapName) {
				unnamedMaps++;
				mapName = `Unnamed map ${unnamedMaps}`;
			}
			mapOptions.set(saves[i].internalId, mapName);
		}

		return mapOptions;
	}
}