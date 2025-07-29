import { EntityComponentStorage } from "shapez/game/entity_components";
import { RotationCodes } from "../shapes/rotationCodes";

export class MinerDescriptor {
	static info = `Mines shapes when placed on top of a shape patch.\r\n` +
	`Mined shapes get deployed to it's facing direction.\r\n` +
	`Don't worry about the shape patches. They never run out of shapes.`;

	/**
	 * @param {EntityComponentStorage} miner
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static describe(miner) {
		const log = {msg:"", describedIDs:new Array()};
		const origin = miner.StaticMapEntity.origin;
		const currentDirection = miner.StaticMapEntity.originalRotation;
		const rotName = RotationCodes.getRotationName(currentDirection);
		log.msg = `Found miner at x: ${origin.x}, y: ${origin.y} ` +
		`facing ${rotName}`;
		return log;
	}
}