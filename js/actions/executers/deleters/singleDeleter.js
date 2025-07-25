import { Vector } from "shapez/core/vector";
import { SOUNDS } from "shapez/platform/sound";

/** Allows removing a single building.*/
export class SingleDeleter {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/**
	 * @param {number} posX
	 * @param {number} posY
	 * @returns {{valid:boolean, msg:string}} */
	tryDeleteBuilding(posX, posY) {
		const pos = new Vector(posX, posY);
		const contents = this.#root.map.getTileContent(pos, this.#root.currentLayer);

		if (contents) {
			const buildName = contents.components.StaticMapEntity.getMetaBuilding().getId();
			if (this.#root.logic.tryDeleteBuilding(contents)) {
				this.#root.soundProxy.playUi(SOUNDS.destroyBuilding);
				return {
					valid: true,
					msg: `Successfully deleted a ${buildName} at x: ${posX}, y: ${posY}.`
				};
			}
			else {
				return {
					valid: false,
					msg: `You cannot delete the ${buildName} building!`
				};
			}
		}
		else {
			return {
				valid: false,
				msg: `There's no building at x: ${posX}, y: ${posY}.`
			};
		}
	}
}