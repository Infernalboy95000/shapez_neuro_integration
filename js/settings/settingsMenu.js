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
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {HTMLDivElement} */ #menu;
	/** @type {HTMLButtonElement} */ #button;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;

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

		this.#mod.app.sound.playUiSound(SOUNDS.uiClick);
	}

	#onButtonMouseDown() {
		this.#button.classList.add("selected");
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
		const connSettings = new ConnectionSettings(this.#mod, this.#root);

		connSettings.addSdkButton(new ButtonSetting(
			this.#menu,
			"SDK integration",
			"Connect the SDK integration to your player",
			"Connect",
			ButtonSetting.Style.DEFAULT,
			"sdkStatus"
		));

		connSettings.addSdkURL(new TextSetting (
			this.#menu,
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
			this.#menu,
			"Coordinates grid",
			"Shows every tile's x/y position. Maybe usefull when using external vision.",
			"sdkCoordsGrid"
		));
	}

	#startupSettings() {
		new SettingCategory(this.#menu, "Startup");

		const startupSettngs = new StartupSettings(this.#mod, this.#root);

		startupSettngs.addAutoConnectToogle(new ToggleSetting (
			this.#menu,
			"Auto connect to player",
			"Attempts to connect to the player when launching the game",
			"sdkPlayerAutoConnect"
		));

		startupSettngs.addPlayerChooseMapToggle(new ToggleSetting (
			this.#menu,
			"Player can choose map",
			"Allows the player to start a map. This can be limited to certain maps.",
			"sdkPlayerChooseMap"
		));

		startupSettngs.addForceOpenMapToggle(new ToggleSetting (
			this.#menu,
			"Force open map",
			"Opens a map when entering the main menu. This can be limited to certain maps.",
			"sdkForceOpenMap"
		));

		new OptionListSetting(
			this.#menu,
			"Map to open",
			"Which map will be allowed to be open by the player or forced to open",
			["Option 1", "Option 2"], 0,
			"sdkMapOpenAvailable",
		)
	}
}