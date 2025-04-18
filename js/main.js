import { Mod } from "shapez/mods/mod";
import { SOUNDS	} from "shapez/platform/sound";
import { NeuroListener } from "./neuroListener";

let neuroListener;

class ModImpl extends Mod {
    init() {
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
		label.textContent =	"Enable	SDK	integration";
		row.appendChild(label);

		const value	= document.createElement("div");
		value.classList.add("value", "checkbox");
		value.setAttribute("data-setting", "sdkStatus");

		value.addEventListener("click",	() => {
			if (value.classList.contains("checked")) {
				neuroListener.disconnect();
				value.classList.remove("checked");
			}
			else {
				neuroListener = new NeuroListener('ws://localhost:8000');
				value.classList.add("checked");
			}

			this.app.sound.playUiSound(SOUNDS.uiClick);
		});

		value.addEventListener("mousedown",	() => {
			value.classList.add("selected");
		});

		value.addEventListener("mouseup", () => {
			value.classList.remove("selected");
		});

		row.appendChild(value);

		const knob = document.createElement("span");
		knob.classList.add("knob");
		value.appendChild(knob);

		const description =	document.createElement("div")
		description.classList.add("desc");
		description.textContent	= "Connect the SDK integration to your player";
		setting.appendChild(description);

		return menu;
	}
}
