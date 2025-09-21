import { BeltComponent } from "shapez/game/components/belt";
import { StaticMapEntityComponent } from "shapez/game/components/static_map_entity";

export class PauseMenuDescriptor {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	}

	/** @returns {string} */
	describe() {
		const minutesPlayed = Math.ceil(this.#root.time.now() / 60);
		const numBelts = this.#root.entityMgr.getAllWithComponent(BeltComponent).length;
		const numBuilds = this.#root.entityMgr.getAllWithComponent(StaticMapEntityComponent).length - numBelts;

		const msg = `Belts placed: ${numBelts}. ` +
		`Buildings placed: ${numBuilds}. ` +
		`Minutes played: ${minutesPlayed}.`;

		return msg;
	}
}