import { Vector } from "shapez/core/vector";
import { EntityComponentStorage } from "shapez/game/entity_components";
import { RotationCodes } from "../../shapes/rotationCodes";
import { RandomUtils } from "../../../../custom/randomUtils";

export class ItemAcceptorInfo {
	/**
	 * @param {EntityComponentStorage} components
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 */
	static describe(components) {
		const log = {msg:"", describedIDs:new Array()};
		const info = this.#info(components);

		info.forEach((input, filter) => {
			log.msg += `Accepts ${filter} on inputs:`
			input.forEach((slots, direction) => {
				log.msg += `\r\nfrom ${direction}:`

				for (let i = 0; i < slots.length; i++) {
					log.msg += ` x: ${slots[i].x}, y: ${slots[i].y}.`;
				}
			});
			log.msg += "\r\n";
		});

		return log;
	}

	/**
	 * @param {EntityComponentStorage} components
	 * @returns {Map<string, Map<string, Array<Vector>>>}
	 */
	static #info(components) {
		const origin = components.StaticMapEntity.origin;
		const baseRot = components.StaticMapEntity.rotation;
		const slots = components.ItemAcceptor.slots;

		/** @type {Map<string, Map<string, Array<Vector>>>} */
		const filteredInputs = new Map();

		for (let i = 0; i < slots.length; i++) {
			let rotation = RotationCodes.getAngle(slots[i].direction);
			rotation += baseRot;
			if (rotation >= 360) { rotation -= 360; }
			const direction = RotationCodes.getDirectionName(rotation);

			let rotPos = RandomUtils.directionalSize(slots[i].pos, baseRot);
			rotPos = RandomUtils.vectorAddDir(rotPos, direction, 1);
			const pos = rotPos.add(origin);
			let filter = slots[i].filter;
			let inputs;
			if (filteredInputs.has(filter)) {
				inputs = filteredInputs.get(filter);
			}
			else if (!filter) {
				filter = "anything";
			}

			if (!inputs) {
				inputs = new Map();
			}

			let accceptors;
			
			if (inputs.has(direction)) {
				accceptors = inputs.get(direction);
				accceptors.push(pos);
			}
			else {
				accceptors = new Array(pos);
			}
			inputs.set(direction, accceptors);
			filteredInputs.set(filter, inputs);
		}
		return filteredInputs;
	}
}