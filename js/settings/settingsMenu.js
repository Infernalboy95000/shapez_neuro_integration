import { SOUNDS	} from "shapez/platform/sound";
import { SdkSettings } from "./sdkSettings";
import { ToggleSetting } from "./toggleSetting";
import { InputSetting } from "./inputSetting";

export class SettingsMenu {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {HTMLDivElement} */ #menu;
	/** @type {HTMLButtonElement} */ #button;

	/**
	 //* @param {import("shapez/mods/mod").Mod} mod
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
		const settings = new SdkSettings(this.#mod, this.#root);

		settings.addSdkToogle(new ToggleSetting (
			this.#menu,
			"SDK integration",
			"Connect the SDK integration to your player",
			"sdkStatus"
		));

		settings.addSdkURL(new InputSetting (
			this.#menu,
			"SDK URL",
			"The URL the SDK will use next time is connected",
			"sdkURL",
			"text",
			this.#mod.settings.socketURL,
			256
		));
	}
}