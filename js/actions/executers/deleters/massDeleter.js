import { Entity } from "shapez/game/entity";
import { AreaSelector } from "../selectors/areaSelector";
import { ACHIEVEMENTS } from "shapez/platform/achievement_provider";

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

		this.#executeDelete(selection);
		return {
			valid: true,
			msg: `Successfully deleted ${selSize} building${selSize > 1 ? "s": ""}`
		};
		/*
		!TEMPORAL. NEED TO SHOW THE CONFIRMATION IF IT'S ACTIVE IN SETTINGS!
		else if (this.#confirmDelete()) {
			this.#doDelete();
			msg = `Successfully deleted ${selSize} building${selSize > 1 ? "s": ""}`;
		}
		else {
			msg = `You're about to delete ${selSize} buildings. Are you sure?`;
		}
		*/
	}

	/** @param {Set} selection */
	#executeDelete(selection) {
		const entityUids = Array.from(selection);

		// Build mapping from uid to entity
		/**
		 * @type {Map<number, Entity>}
		 */
		const mapUidToEntity = this.#root.entityMgr.getFrozenUidSearchMap();

		let count = 0;
		this.#root.logic.performBulkOperation(() => {
			for (let i = 0; i < entityUids.length; ++i) {
				const uid = entityUids[i];
				const entity = mapUidToEntity.get(uid);
				if (!entity) {
					continue;
				}

				if (this.#root.logic.tryDeleteBuilding(entity)) {
					count++;
				}
			}

			this.#root.signals.achievementCheck.dispatch(ACHIEVEMENTS.destroy1000, count);
		});
	}

	/*
	? Storing for later
	#confirmDelete() {
		if (
			!this.#root.app.settings.getAllSettings().disableCutDeleteWarnings &&
			this.#selection.size > 100
		) {
			const { ok } = this.#root.hud.parts.dialogs.showWarning(
				T.dialogs.massDeleteConfirm.title,
				T.dialogs.massDeleteConfirm.desc.replace(
					"<count>",
					"" + formatBigNumberFull(this.#selection.size)
				),
				["cancel:good:escape", "ok:bad:enter"]
			);
			ok.add(() => this.#doDelete());
			return false;
		}
		return true;
	}
	*/
}