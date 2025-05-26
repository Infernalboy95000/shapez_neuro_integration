import { SOUNDS	} from "shapez/platform/sound";
import { SettingCategory } from "./settingsCategory";
import { ToggleSetting } from "./toggleSetting";
import { InputSetting } from "./inputSetting";
import { ConnextionSettings } from "./connextionSettings";
import { ContextSettings } from "./contextSettings";

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
	}

	#connextionSettings() {
		new SettingCategory(this.#menu, "Player connextion", true);
		const connSettings = new ConnextionSettings(this.#mod, this.#root);

		connSettings.addSdkToogle(new ToggleSetting (
			this.#menu,
			"SDK integration",
			"Connect the SDK integration to your player",
			"sdkStatus"
		));

		connSettings.addSdkURL(new InputSetting (
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
		const contextSettings = new ContextSettings(this.#mod, this.#root);

		contextSettings.addCorodsGridToogle(new ToggleSetting (
			this.#menu,
			"Coordinates grid",
			"Shows every tile's x/y position. Maybe usefull when using external vision.",
			"sdkCoordsGrid"
		));
	}
}