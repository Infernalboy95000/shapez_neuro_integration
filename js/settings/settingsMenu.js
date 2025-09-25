import { SOUNDS	} from "shapez/platform/sound";
import { ConnectionStructure } from "./structure/connectionStructure";
import { ContextStructure } from "./structure/contextStructure";
import { StartupStructure } from "./structure/startupStructure";
import { InfoStructure } from "./structure/infoStructure";
import { DangerousStructure } from "./structure/dangerousStructure";

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
		ConnectionStructure.build(this.#mod, this.#menu);
		ContextStructure.build(this.#mod, this.#menu);
		StartupStructure.build(this.#mod, this.#menu);
		DangerousStructure.build(this.#mod, this.#menu);
		InfoStructure.build(this.#mod, this.#menu);
	}
}