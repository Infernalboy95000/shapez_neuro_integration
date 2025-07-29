import { Vector } from "shapez/core/vector";
import { EntityComponentStorage } from "shapez/game/entity_components";

export class HubDescriptor {
	/**
	 * @param {EntityComponentStorage} hub
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static describe(hub) {
		/** @type {Map<string, Array<Vector>>} */
		const slotsByDir = new Map();
		const log = {msg:"", describedIDs:new Array()};
		const origin = hub.StaticMapEntity.origin;
		const slots = hub.ItemAcceptor.slots;

		for (let i = 0; i < slots.length; i++) {
			const pos = slots[i].pos.add(origin);
			let accceptors;
			if (slotsByDir.has(slots[i].direction)) {
				accceptors = slotsByDir.get(slots[i].direction);
				accceptors.push(pos);
			}
			else {
				accceptors = new Array(pos);
			}
			slotsByDir.set(slots[i].direction, accceptors);
		}

		log.msg = `Found hub at x: ${origin.x}, y: ${origin.y}.`;
		if (slots.length > 0) {
			log.msg += ` Accepts items:`
		}

		slotsByDir.forEach((slots, direction) => {
			log.msg += `\nfrom ${direction}:`

			for (let i = 0; i < slots.length; i++) {
				log.msg += ` x: ${slots[i].x}, y: ${slots[i].y}.`;
			}
		});

		return log;
	}
}