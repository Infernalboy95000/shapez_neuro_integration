import { Vector } from "shapez/core/vector";
import { EntityComponentStorage } from "shapez/game/entity_components";
import { RandomUtils } from "../../../../custom/randomUtils";
import { RotationCodes } from "../../shapes/rotationCodes";

export class ItemEjectorInfo {
	/**
	 * @param {EntityComponentStorage} components
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 */
	static describe(components) {
		const log = {msg:"", describedIDs:new Array()};
		const info = this.#info(components);

		log.msg += `Outputs:`
		info.forEach((slots, direction) => {
			log.msg += `\nto ${direction}:`
			for (let i = 0; i < slots.length; i++) {
				log.msg += ` x: ${slots[i].x}, y: ${slots[i].y}.`;
			}
		});

		return log;
	}

	/**
	 * @param {EntityComponentStorage} components
	 * @returns {Map<string, Array<Vector>>}
	 */
	static #info(components) {
		const origin = components.StaticMapEntity.origin;
		const baseRot = components.StaticMapEntity.rotation;
		const slots = components.ItemEjector.slots;

		/** @type {Map<string, Array<Vector>>} */
		const outputs = new Map();

		for (let i = 0; i < slots.length; i++) {
			let rotation = RotationCodes.getAngle(slots[i].direction);
			rotation += baseRot;
			if (rotation >= 360) { rotation -= 360; }
			const direction = RotationCodes.getDirectionName(rotation);
			
			let rotPos = RandomUtils.directionalSize(slots[i].pos, baseRot);
			rotPos = RandomUtils.vectorAddDir(rotPos, direction, 1);
			const pos = rotPos.add(origin);

			let accceptors;
			if (outputs.has(direction)) {
				accceptors = outputs.get(direction);
				accceptors.push(pos);
			}
			else {
				accceptors = new Array(pos);
			}
			outputs.set(direction, accceptors);
		}
		return outputs;
	}
}