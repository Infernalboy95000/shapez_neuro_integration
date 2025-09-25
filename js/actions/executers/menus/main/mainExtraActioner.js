export class MainExtraActioner {
	/** @type {import("shapez/states/main_menu").MainMenuState} */ #state

	/** @param {import("shapez/states/main_menu").MainMenuState} state */
	constructor(state) {
		this.#state = state;
	}

	closeGame() {
		this.#state.onBackButton();
	}
}