import { AreaSelector } from "../selectors/areaSelector";
import { HUDMassSelector } from "shapez/game/hud/parts/mass_selector";

/** Allows removing an entire area full of buildings.*/
export class MassDeleter {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {AreaSelector} */ #areaSelector;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		this.#areaSelector = new AreaSelector(root);
	}

	/**
	 * @param {number} posX_1 @param {number} posY_1
	 * @param {number} posX_2 @param {number} posY_2
	 * @returns {{valid:boolean, msg:string}} */
	areaDelete(posX_1, posY_1, posX_2, posY_2) {
		const selection = this.#areaSelector.selectArea(posX_1, posY_1, posX_2, posY_2);
		const selSize = selection.size;

		if (selSize <= 0) {
			return {
				valid: false,
				msg: `No buildings selected`
			};
		}

		/** @type {HUDMassSelector} */ //@ts-ignore
		const selector = this.#root.hud.parts.massSelector;
		selector.selectedUids = new Set(selection);
		selector.confirmDelete();
		if (
			!this.#root.app.settings.getAllSettings().disableCutDeleteWarnings &&
			selector.selectedUids.size > 100
		) {
			return {
				valid: true,
				msg: "The command was sent, but, as the current dialog says, you need to confirm it."
			}
		}
		else {
			return {
				valid: true,
				msg: `Successfully deleted ${selSize} building${selSize > 1 ? "s": ""}`
			};
		}
	}
}