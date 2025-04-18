import { Mod } from "shapez/mods/mod";
import { SOUNDS	} from "shapez/platform/sound";
import { NeuroListener } from "./neuroListener";
const DEFAULT_URL = "ws://localhost:8000";


class ModImpl extends Mod {
	init() {
		if (this.settings.socketURL == undefined)
		{
			this.settings.socketURL = DEFAULT_URL;
			this.saveSettings();
		}

		this.neuroListener = new NeuroListener(this.settings.socketURL);

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
		setting.classList.add("setting", "cardbox",	"enabled");
		menu.appendChild(setting);

		const row =	document.createElement("div")
		row.className =	"row"
		setting.appendChild(row);

		const label	= document.createElement("label");
		label.textContent =	"SDK integration";
		row.appendChild(label);

		const toggle = document.createElement("div");
		toggle.classList.add("value", "checkbox");
		toggle.setAttribute("data-setting", "sdkStatus");

		if (NeuroListener.isConnected()) {
			toggle.classList.add("checked");
		}

		toggle.addEventListener("click", () => {
			if (toggle.classList.contains("checked")) {
				NeuroListener.disconnect();
				toggle.classList.remove("checked");
			}
			else {
				NeuroListener.connected = () => { this.onConnected(label, toggle) };
				NeuroListener.disconnected = () => { this.onDisconnected(label, toggle) };
				NeuroListener.reattempting = () => { this.onReattempting(label, toggle) };
				NeuroListener.closed = () => { this.onClosed(label, toggle) };
				NeuroListener.failed = () => { this.onFailed(label, toggle) };

				label.textContent =	"Connecting...";
				NeuroListener.tryConnect();
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

		const description =	document.createElement("div")
		description.classList.add("desc");
		description.textContent	= "Connect the SDK integration to your player";
		setting.appendChild(description);

		return menu;
	}

	onConnected(label, toggle) {
		label.textContent = "SDK integration";
		if (!toggle.classList.contains("checked"))
			toggle.classList.add("checked");
	}

	onDisconnected(label, toggle) {
		label.textContent = "SDK integration";
		if (toggle.classList.contains("checked"))
			toggle.classList.remove("checked");
	}

	onReattempting(label, toggle,) {
		label.textContent = `Connecting... (${NeuroListener.getRetriesFormatted()})`;
		if (toggle.classList.contains("checked"))
			toggle.classList.remove("checked");
	}

	onClosed(label, toggle) {
		label.textContent = "SDK integration";
		if (toggle.classList.contains("checked"))
			toggle.classList.remove("checked");
	}

	onFailed(label, toggle) {
		label.textContent = "SDK integration";
		if (toggle.classList.contains("checked"))
			toggle.classList.remove("checked");
	}
}
