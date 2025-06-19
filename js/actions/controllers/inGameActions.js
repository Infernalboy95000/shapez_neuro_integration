import { SdkClient } from "../../sdkClient";
import { EnumSchema } from "../definitions/schema/enumSchema";
import { InGameBuilder } from "../executers/inGameBuilder";
import { ActionList } from "../lists/actionList";
import { InGameActionList } from "../lists/inGameActionList";
import { MetaBuilding } from "shapez/game/meta_building";

export class InGameActions {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ActionList} */ #actions;
	/** @type {InGameBuilder} */ #builder;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;
		this.#actions = new ActionList();
	}

	gameOpenned() {
		if (SdkClient.isConnected()) {
			this.#builder = new InGameBuilder(this.#root);
			this.#actions.removeAllActions();
			this.#promptToolbelt();
			this.#actions.addAction(InGameActionList.SELECT_BUILDING);
			this.#actions.activateActions();
		}
	}

	gameClosed() {
		this.#actions.deactivateActions();
	}

	playerSentAction(action) {
		if (!this.#isActionValid(action)) {
			SdkClient.tellActionResult(
				action.id, false,
				`Unknown action`
			)
		}
	}

	/** @retuns {boolean} */
	#isActionValid(action) {
		switch (action.name) {
			case InGameActionList.SELECT_BUILDING.getName():
				const result = this.#builder.selectBuilding(action.params.buildings);

				switch (result) {
					case "SELECTED":
						SdkClient.tellActionResult(
							action.id, true, `${action.params.buildings} building is selected`
						)
						break;
					case "DESELECTED":
						SdkClient.tellActionResult(
							action.id, true, `${action.params.buildings} building is deselected. (It was already selected)`
						)
						break;
					case "LOCKED":
						SdkClient.tellActionResult(
							action.id, true, `${action.params.buildings} is not unlocked, yet.`
						)
						break;
				}
				return true;
			default:
				return false;
		}
	}

	#promptToolbelt() {
		const buildingNames = [];
		const buildings = this.#builder.getToolbelt();
		for (let i = 0; i < buildings.length; i++) {
			buildingNames.push(buildings[i].getId());
		}

		const buildingsSchema = new EnumSchema("buildings", buildingNames);
		InGameActionList.SELECT_BUILDING.setOptions([buildingsSchema]);
	}
}