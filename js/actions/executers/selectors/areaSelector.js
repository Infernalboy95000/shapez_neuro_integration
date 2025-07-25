import { Vector } from "shapez/core/vector";

export class AreaSelector {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
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
		return selection;
	}
}