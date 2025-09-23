import { HUDBlueprintPlacer } from "shapez/game/hud/parts/blueprint_placer";

export class BlueprintInfo {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {HUDBlueprintPlacer} */ #placer;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		this.#placer = this.#root.hud.parts.blueprintPlacer
	}

	/** @returns {boolean} */
	has() {
		const blueprint = this.#placer.currentBlueprint.get();
		if (blueprint) {
			return true;
		}
		else {
			return false;
		}
	}

	/** @returns {number} */
	getCost() {
		const blueprint = this.#placer.currentBlueprint.get();
		if (blueprint == null)
			return -1;
		else
			return blueprint.getCost();
	}

	/** @returns {boolean} */
	clear() {
		if (this.has()) {
			this.#placer.abortPlacement();
			return true;
		}
		else {
			return false;
		}
	}
}