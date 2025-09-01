import { Vector } from "shapez/core/vector";
import { EntityComponentStorage } from "shapez/game/entity_components";
import { RandomUtils } from "../../../../custom/randomUtils";
import { RotationCodes } from "../../shapes/rotationCodes";
import { BaseItem } from "shapez/game/base_item";
import { ShapeItem } from "shapez/game/items/shape_item";
import { ShapeCode } from "../../shapes/shapeCode";
import { ColorItem } from "shapez/game/items/color_item";
import { ColorCodes } from "../../shapes/colorCodes";

export class ItemEjectorInfo {
	/**
	 * @param {EntityComponentStorage} components
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 */
	static describe(components) {
		const log = {msg:"", describedIDs:new Array()};
		const info = this.#info(components);

		if (info.size > 0)
			log.msg += `Outputs:`

		console.log(info);
		info.forEach((slots, direction) => {
			log.msg += `\nto ${direction}:`
			for (let i = 0; i < slots.length; i++) {
				log.msg += ` x: ${slots[i].pos.x}, y: ${slots[i].pos.y}`;
				if (slots[i].item != null) {
					if (slots[i].item instanceof ShapeItem) {
						const desc = ShapeCode.describe(slots[i].item.definition);
						log.msg += `, is trying to eject: ${desc} shape`;
					}
					else if (slots[i].item instanceof ColorItem) {
						const desc = ColorCodes.describe(slots[i].item.color);
						log.msg += `, is trying to eject: ${desc} color`;
					}
				}
				log.msg += ".";
			}
		});

		return log;
	}

	/**
	 * @param {EntityComponentStorage} components
	 * @returns {Map<string, Array<{pos:Vector, item:BaseItem}>>}
	 */
	static #info(components) {
		const origin = components.StaticMapEntity.origin;
		const baseRot = components.StaticMapEntity.rotation;
		const slots = components.ItemEjector.slots;

		/** @type {Map<string, Array<{pos:Vector, item:BaseItem}>>} */
		const outputs = new Map();

		for (let i = 0; i < slots.length; i++) {
			let rotation = RotationCodes.getAngle(slots[i].direction);
			rotation += baseRot;
			if (rotation >= 360) { rotation -= 360; }
			const direction = RotationCodes.getDirectionName(rotation);
			
			let rotPos = RandomUtils.directionalSize(slots[i].pos, baseRot);
			rotPos = RandomUtils.vectorAddDir(rotPos, direction, 1);
			const finalPos = rotPos.add(origin);

			let accceptors;
			if (outputs.has(direction)) {
				accceptors = outputs.get(direction);
				accceptors.push({pos:finalPos, item:slots[i].item});
			}
			else {
				accceptors = new Array({pos:finalPos, item:slots[i].item});
			}
			outputs.set(direction, accceptors);
		}
		return outputs;
	}
}