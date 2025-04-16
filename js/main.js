import { Mod } from "shapez/mods/mod";
import { SOUNDS } from "shapez/platform/sound";

class ModImpl extends Mod {
	init() {
		this.signals.stateEntered.add(state	=> {
			if (state.key === "SettingsState") {
				this.settings.timesOpen++;
				this.saveSettings();
				const someMenu = this.ModSettingsMenu();

				const parent = document.querySelector(".sidebar");
				const otherBlock = document.querySelector(".other");
				const container = document.querySelector(".categoryContainer");
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
				parent.insertBefore(settingsButton, otherBlock);
			}
		});
	}

	ModSettingsMenu() {
		const menu = document.createElement("div");
		menu.classList.add("category");
		menu.setAttribute("data-category", "neuroSdk");

		const setting = document.createElement("div")
		setting.classList.add("setting", "cardbox", "enabled");
		menu.appendChild(setting);

		const row = document.createElement("div")
		row.className = "row"
		setting.appendChild(row);

		const label = document.createElement("label");
		label.textContent = "This is a setting";
		row.appendChild(label);

		const value = document.createElement("div");
		value.classList.add("value", "int");
		value.setAttribute("data-setting", "test");
		value.textContent = `Times launched: ${this.settings.timesOpen}`
		row.appendChild(value);

		const description = document.createElement("div")
		description.classList.add("desc");
		description.textContent = "This is a non functional setting. (for now)";
		setting.appendChild(description);

		return menu;
	}
}
