import { formatBigNumberFull } from "shapez/core/utils";
import { Vector } from "shapez/core/vector";
import { Entity } from "shapez/game/entity";
import { T } from "shapez/translations";

export class InGameMassSelector {
	/** @type {Set} */ #selection;
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/**
	 * @param {number} posX_1
	 * @param {number} posY_1
	 * @param {number} posX_2
	 * @param {number} posY_2
	 * @returns {string} */
	areaDelete(posX_1, posY_1, posX_2, posY_2) {
		this.#selectArea(posX_1, posY_1, posX_2, posY_2);
		const selSize = this.#selection.size;
		let msg = "";
		if (selSize <= 0) {
			msg = `No buildings selected`;
		}
		else if (this.#confirmDelete()) {
			this.#doDelete();
			msg = `Successfully deleted ${selSize} building${selSize > 1 ? "s": ""}`;
		}
		else {
			msg = `You're about to delete ${selSize} buildings. Are you sure?`;
		}
		this.#selection = new Set();

		return msg;
	}

	/**
	 * @param {number} posX_1
	 * @param {number} posY_1
	 * @param {number} posX_2
	 * @param {number} posY_2
	 * */
	#selectArea(posX_1, posY_1, posX_2, posY_2) {
		const pos1 = new Vector(posX_1, posY_1);
		const pos2 = new Vector(posX_2, posY_2);

		const realTileStart = pos1.min(pos2);
		const realTileEnd = pos1.max(pos2);

		this.#selection = new Set();
		for (let x = realTileStart.x; x <= realTileEnd.x; ++x) {
			for (let y = realTileStart.y; y <= realTileEnd.y; ++y) {
				const contents = this.#root.map.getLayerContentXY(x, y, this.#root.currentLayer);

				if (contents && this.#root.logic.canDeleteBuilding(contents)) {
					const staticComp = contents.components.StaticMapEntity;

					if (!staticComp.getMetaBuilding().getIsRemovable(this.#root)) {
						continue;
					}

					this.#selection.add(contents.uid);
				}
			}
		}
	}

	/** @returns {boolean} */
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

	#doDelete() {
		const entityUids = Array.from(this.#selection);

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

			//? This is interesting. Should the SDK reward real archivements?
			//this.#root.signals.achievementCheck.dispatch(ACHIEVEMENTS.destroy1000, count);
		});
	}
}