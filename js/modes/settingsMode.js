import { SdkClient } from "../sdkClient";
import { SettingsMenu } from "../settings/settingsMenu";

export class SettingsMode {
	/** @type {SettingsMenu} */ #settingsMenu;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 */
	constructor(mod) {
		this.#settingsMenu = new SettingsMenu(mod);
	}

	menuOpenned() {
		this.#settingsMenu.showMenu();

		if (SdkClient.isConnected()) {
			this.#removeGameplayActions();
		}
	}

	playerSentAction(action) {
		SdkClient.tellActionResult(
			action.id, false,
			`You have no permissions to move or change settings. ` +
			`Please, wait till a human exists from the settings menu.`
		)
	}

	playerConntected() {
		SdkClient.sendMessage(
			`Welcome to shapez. ` +
			`Please, wait till a human finishes setting up your SDK permissions to play.`,
			true
		)
	}

	#removeGameplayActions() {
		SdkClient.sendMessage(
			`A human entered the settings menu. ` +
			`Please, wait patiently till they finish.`,
			true
		);
	}
}