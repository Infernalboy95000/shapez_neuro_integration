import { Mod } from "shapez/mods/mod";
import { SOUNDS	} from "shapez/platform/sound";
import { NeuroListener } from "./neuroListener";
const DEFAULT_URL = "ws://localhost:8000";


class ModImpl extends Mod {
	init() {
		if (this.settings.socketURL == undefined) {
			this.settings.socketURL = DEFAULT_URL;
			this.saveSettings();
		}

		this.signals.stateEntered.add(state	=> {
			if (state.key === "SettingsState") {
				this.settings.timesOpen++;
				this.saveSettings();
				const someMenu = this.ModSettingsMenu();

				const parent = document.querySelector(".sidebar");
				const otherBlock = document.querySelector(".other");
				const container	= document.querySelector(".categoryContainer");
				container.appendChild(someMenu);

				const settingsButton = document.createElement("button");
				settingsButton.classList.add("styledButton", "categoryButton");
				settingsButton.setAttribute("data-category-btn", "neuroSdk");
				settingsButton.innerText = "Nuero SDK";
				settingsButton.addEventListener("click", () => {
					const previousCategory = document.querySelector(".category.active");
					const previousCategoryButton = document.querySelector(".categoryButton.active");

					previousCategory.classList.remove("active");
					previousCategoryButton.classList.remove("active");

					settingsButton.classList.add("active")
					someMenu.classList.add("active");

					this.app.sound.playUiSound(SOUNDS.uiClick);
				});

				settingsButton.addEventListener("mousedown", () => {
					settingsButton.classList.add("selected");
				});

				settingsButton.addEventListener("mouseup", () => {
					settingsButton.classList.remove("selected");
				});
				parent.insertBefore(settingsButton,	otherBlock);
			}
		});
	}
	
	ModSettingsMenu() {
		const menu = document.createElement("div");
		menu.classList.add("category");
		menu.setAttribute("data-category", "neuroSdk");

		const setting =	document.createElement("div")
		setting.classList.add("setting", "cardbox", "enabled");
		menu.appendChild(setting);

		const row =	document.createElement("div")
		row.className = "row"
		setting.appendChild(row);

		const label	= document.createElement("label");
		label.textContent = "SDK integration";
		row.appendChild(label);

		const toggle = document.createElement("div");
		toggle.classList.add("value", "checkbox");
		toggle.setAttribute("data-setting", "sdkStatus");

		if (NeuroListener.isConnected()) {
			toggle.classList.add("checked");
		}

		const description2 = document.createElement("div");
		description2.classList.add("desc");
		description2.textContent = "The URL the SDK will use next time is connected.";
		if (NeuroListener.isConnected()) {
			description2.textContent += ` Connected to: ${NeuroListener.getCurrentURL()}`;
		}

		toggle.addEventListener("click", () => {
			if (toggle.classList.contains("checked")) {
				NeuroListener.disconnect();
				toggle.classList.remove("checked");
			}
			else {
				NeuroListener.connected = () => { this.onConnected(label, toggle, description2) };
				NeuroListener.disconnected = () => { this.onDisconnected(label, toggle, description2) };
				NeuroListener.reattempting = () => { this.onReattempting(label, toggle, description2) };
				NeuroListener.closed = () => { this.onClosed(label, toggle, description2) };
				NeuroListener.failed = () => { this.onFailed(label, toggle, description2) };

				label.textContent = "Connecting...";
				description2.textContent = `The URL the SDK will use next time is connected. Attempting connection at: ${this.settings.socketURL} ...`;

				NeuroListener.tryConnect(this.settings.socketURL);
			}

			this.app.sound.playUiSound(SOUNDS.uiClick);
		});

		toggle.addEventListener("mousedown", () => {
			toggle.classList.add("selected");
		});

		toggle.addEventListener("mouseup", () => {
			toggle.classList.remove("selected");
		});

		row.appendChild(toggle);

		const knob = document.createElement("span");
		knob.classList.add("knob");
		toggle.appendChild(knob);

		const description = document.createElement("div")
		description.classList.add("desc");
		description.textContent = "Connect the SDK integration to your player";
		setting.appendChild(description);


		const setting2 = document.createElement("div")
		setting2.classList.add("setting", "cardbox", "enabled");
		menu.appendChild(setting2);

		const row2 = document.createElement("div")
		row2.className = "row"
		setting2.appendChild(row2);

		const label2 = document.createElement("label");
		label2.textContent = "Websocket URL";
		row2.appendChild(label2);

		const inputElement = document.createElement("div");
		inputElement.classList.add("formElement", "input");
		inputElement.setAttribute("data-setting", "sdkURL");
		row2.appendChild(inputElement);

		const inputText = document.createElement("input");
		inputText.value = this.settings.socketURL;
		inputText.maxLength = 128;
		inputText.autocomplete = "off";
		inputText.autocapitalize = "off";
		inputText.spellcheck = false;
		inputText.classList.add("input-text");

		if (inputText.value == "") {
			inputText.classList.add("errored");
		}

		inputText.addEventListener("focusout", () => {
			this.settings.socketURL = inputText.value;
			this.saveSettings();
		});

		inputText.addEventListener("input", () => {
			if (inputText.value != "") {
				if (inputText.classList.contains("errored")) {
					inputText.classList.remove("errored");
				}
			}
			else if (!inputText.classList.contains("errored")){
				inputText.classList.add("errored");
			}
		});

		inputElement.appendChild(inputText);

		
		
		setting2.appendChild(description2);

		return menu;
	}

	onConnected(label, toggle, desc2) {
		label.textContent = "SDK integration";
		if (!toggle.classList.contains("checked"))
			toggle.classList.add("checked");

		desc2.textContent = `The URL the SDK will use next time is connected. Connected to: ${NeuroListener.getCurrentURL()}`;
	}

	onDisconnected(label, toggle, desc2) {
		label.textContent = "SDK integration";
		if (toggle.classList.contains("checked"))
			toggle.classList.remove("checked");
		
		desc2.textContent = "The URL the SDK will use next time is connected.";
	}

	onReattempting(label, toggle, desc2) {
		label.textContent = `Connecting... (${NeuroListener.getRetriesFormatted()})`;
		if (toggle.classList.contains("checked"))
			toggle.classList.remove("checked");
		
		desc2.textContent = `The URL the SDK will use next time is connected. Attempting connection at: ${NeuroListener.getCurrentURL()} ...`;
	}

	onClosed(label, toggle, desc2) {
		label.textContent = "SDK integration";
		if (toggle.classList.contains("checked"))
			toggle.classList.remove("checked");
		
		desc2.textContent = "The URL the SDK will use next time is connected.";
	}

	onFailed(label, toggle, desc2) {
		label.textContent = "SDK integration";
		if (toggle.classList.contains("checked"))
			toggle.classList.remove("checked");
		
		desc2.textContent = "The URL the SDK will use next time is connected.";
	}
}
