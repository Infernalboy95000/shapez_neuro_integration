import { SOUNDS } from "shapez/platform/sound";

const { SettingBase } = require("./settingBase");

/**
 * Creates a setting which offers a list of options
 * @class OptionListSetting
 * @extends {SettingBase}
 */
export class OptionListSetting extends SettingBase {
	/** @type {CallableFunction} */ onOptionChoosed;

	/** @type {HTMLDivElement} */ #menuAccess;
	/** @type {HTMLDivElement} */ #menu;
	/** @type {HTMLButtonElement} */ #closeMenuBt;
	/** @type {string[]} */ #options;
	/** @type {number} */ #currentOption;
	/** @type {string} */ #title;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {HTMLDivElement} parent
	 * @param {string} title
	 * @param {string} description
	 * @param {string[]} options
	 * @param {number} currentOption
	 * @param {string} attribute
	 */
	constructor(
		mod, parent, title, description, options,
		currentOption = 0, attribute = ""
	) {
		super(mod, parent, title, description);
		this.#options = options;
		this.#title = title;

		this.#ensureValidOption();
		this.#createMenuAccess(currentOption, attribute);
	}

	/**
	 * 
	 * @param {number} optionID
	 * @param {string} attribute 
	 */
	#createMenuAccess(optionID, attribute) {
		this.#menuAccess = document.createElement("div");
		this.#setOption(optionID);
		this.#menuAccess.classList.add("value", "enum");
		if (attribute != "")
			this.#menuAccess.setAttribute("data-setting", attribute);

		this.addToRow(this.#menuAccess);
		this.#setButtonEvents(
			this.#menuAccess, 0, "pressed", this.#onAccessClicked,
			this.#onMouseDown, this.#onMouseUp, this.#onMouseLeave
		);
	}

	/** @param {number} optionID */
	#setOption(optionID) {
		this.#currentOption = optionID;
		this.#menuAccess.textContent = this.#options[optionID];
	}

	/**
	 * @param {HTMLElement} bt
	 * @param {number} ID,
	 * @param {string} classCall,
	 * @param {CallableFunction} click
	 * @param {CallableFunction} mouseDown
	 * @param {CallableFunction} mouseup
	 * @param {CallableFunction} mouseLeave */
	#setButtonEvents(bt, ID, classCall, click, mouseDown, mouseup, mouseLeave) {
		bt.addEventListener("click", () => click(this, bt, ID));
		bt.addEventListener("mousedown", () => mouseDown(this, bt, classCall));
		bt.addEventListener("mouseup", () => mouseup(this, bt, classCall));
		bt.addEventListener("mouseleave", () => mouseLeave(this, bt, classCall));
	}

	#showOptions() {
		document.body.classList.add("modalDialogActive");
		this.#menu = this.#createOptionsMenu();
	}

	/** @returns {HTMLDivElement} */
	#createOptionsMenu() {
		const menuParent = document.querySelector(".modalDialogParent");

		const menuBg = document.createElement("div");
		menuBg.classList.add("ingameDialog", "visible");
		menuBg.style.zIndex = "1000";
		menuParent.appendChild(menuBg);

		const menu = document.createElement("div");
		menu.classList.add(
			"dialogInner", "info", "hasCloseButton",
			"buttonless", "optionChooserDialog"
		);
		menuBg.appendChild(menu);

		const title = document.createElement("h1");
		title.classList.add("title");
		title.textContent = this.#title;
		menu.appendChild(title);
		menu.appendChild(this.#createOptionsContainer());

		this.#closeMenuBt = document.createElement("button");
		this.#closeMenuBt.classList.add("closeButton");
		this.#setButtonEvents(
			this.#closeMenuBt, 0, "pressedSmallElement", this.#onCloseClicked,
			this.#onMouseDown, this.#onMouseUp, this.#onMouseLeave
		)
		title.appendChild(this.#closeMenuBt);

		return menuBg;
	}

	/** @returns {HTMLDivElement} */
	#createOptionsContainer() {
		const optionsContainer = document.createElement("div");
		optionsContainer.classList.add("content");

		const optionsParent = document.createElement("div");
		optionsParent.classList.add("optionParent");
		optionsContainer.appendChild(optionsParent);

		for (let i = 0; i < this.#options.length; i++) {
			const option = this.#createOption(this.#options[i]);
			this.#setButtonEvents(
				option, i, "pressedOption", this.#onOptionClicked,
				this.#onMouseDown, this.#onMouseUp, this.#onMouseLeave
			)
			optionsParent.appendChild(option);
		}

		return optionsContainer;
	}

	/**
	 * @param {string} optionName
	 * @returns {HTMLDivElement}
	 * */
	#createOption(optionName) {
		const option = document.createElement("div");
		option.classList.add("option");
		if (optionName == this.#options[this.#currentOption]) {
			option.classList.add("active");
		}

		option.setAttribute("data-optionvalue", optionName.toLowerCase());

		const spanName = document.createElement("span");
		spanName.classList.add("title");
		spanName.textContent = optionName;
		option.appendChild(spanName);

		return option;
	}

	#ensureValidOption() {
		if (this.#currentOption < 0) {
			this.#currentOption = 0;
		}
		else if (this.#currentOption > this.#options.length) {
			this.#currentOption = this.#options.length - 1;
		}
	}

	/** @param {OptionListSetting} e @param {HTMLElement} button  @param {number} ID */
	#onAccessClicked(e, button, ID) {
		e.#showOptions();
	}

	/** @param {OptionListSetting} e @param {HTMLElement} button  @param {number} ID */
	#onCloseClicked(e, button, ID) {
		document.body.classList.remove("modalDialogActive");
		e.#menu.remove();
	}

	/** @param {OptionListSetting} e @param {HTMLElement} button  @param {number} ID */
	#onOptionClicked(e, button, ID) {
		if (!button.classList.contains("active")) {
			e.#setOption(ID);
			e.#menu.remove();
			e.playSound(SOUNDS.uiClick);
		}
	}

	/** @param {OptionListSetting} e @param {HTMLElement} button  @param {string} classCall */
	#onMouseDown(e, button, classCall) {
		button.classList.add(classCall);

		if (!button.classList.contains("option")) {
			e.playSound(SOUNDS.uiClick);
		}
	}

	/** @param {OptionListSetting} e @param {HTMLElement} button  @param {string} classCall */
	#onMouseUp(e, button, classCall) {
		button.classList.remove(classCall);
	}

	/** @param {OptionListSetting} e @param {HTMLElement} button  @param {string} classCall */
	#onMouseLeave(e, button, classCall) {
		button.classList.remove(classCall);
	}
}