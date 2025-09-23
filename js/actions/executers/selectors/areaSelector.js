import { Vector } from "shapez/core/vector";
import { HUDMassSelector } from "shapez/game/hud/parts/mass_selector";

export class AreaSelector {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {HUDMassSelector} */ #selector;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		// @ts-ignore
		this.#selector = this.#root.hud.parts.massSelector;
	}

	/**
	 * @param {number} posX_1 @param {number} posY_1
	 * @param {number} posX_2 @param {number} posY_2
	 * @returns {Set}
	 * */
	selectArea(posX_1, posY_1, posX_2, posY_2) {
		const pos1 = new Vector(posX_1, posY_1);
		const pos2 = new Vector(posX_2, posY_2);

		const realTileStart = pos1.min(pos2);
		const realTileEnd = pos1.max(pos2);

		const selection = new Set();
		for (let x = realTileStart.x; x <= realTileEnd.x; ++x) {
			for (let y = realTileStart.y; y <= realTileEnd.y; ++y) {
				const contents = this.#root.map.getLayerContentXY(x, y, this.#root.currentLayer);

				if (contents && this.#root.logic.canDeleteBuilding(contents)) {
					const staticComp = contents.components.StaticMapEntity;

					if (!staticComp.getMetaBuilding().getIsRemovable(this.#root)) {
						continue;
					}

					selection.add(contents.uid);
				}
			}
		}

		if (selection.size > 0)
			this.#selector.selectedUids = new Set(selection);
		return selection;
	}

	copySelected() {
		this.#selector.startCopy();
	}

	cutSelected() {
		this.#selector.confirmCut();
	}

	deleteSelected() {
		this.#selector.confirmDelete();
	}

	clearBelts() {
		this.#selector.clearBelts();
	}

	deselect() {
		this.#selector.clearSelection();
	}

	/** @return {boolean} */
	isBig() {
		return this.#selector.selectedUids.size > 100;
	}

	/** @return {boolean} */
	somethingSelected() {
		return this.#selector.selectedUids != null && this.#selector.selectedUids.size > 0;
	}
}