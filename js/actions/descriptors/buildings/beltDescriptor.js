import { EntityComponentStorage } from "shapez/game/entity_components";
import { RotationCodes } from "../shapes/rotationCodes";
import { Entity } from "shapez/game/entity";

export class BeltDescriptor {
	/**
	 * @param {EntityComponentStorage} belt
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static describe(belt) {
		let log = {msg:"", describedIDs:new Array()};
		const path = belt.Belt.assignedPath.entityPath;
		if (path.length > 1) {
			log = this.#describePath(path);
		}
		else {
			const entity = belt.StaticMapEntity;
			const origin = entity.origin;
			const rotName = RotationCodes.getRotationName(entity.rotation);
			log.msg = `Found belt at x: ${origin.x}, y: ${origin.y} ` + 
			`facing ${rotName}`;
		}

		return log;
	}

	/**
	 * @param {Entity[]} path
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static #describePath(path) {
		const log = {msg:"", describedIDs:new Array()}
		let origin = path[0].components.StaticMapEntity.origin;
		const dir = path[0].components.StaticMapEntity.originalRotation;
		const dirName = RotationCodes.getRotationName(dir);
		log.msg = `Found belt line. Starts it's path at: ` +
		`x: ${origin.x}, y: ${origin.y} facing ${dirName}.`;

		let lastDirection = path[0].components.StaticMapEntity.originalRotation;
		for (let i = 0; i < path.length; i++) {
			const entity = path[i].components.StaticMapEntity;
			const currentDirection = entity.originalRotation;
			const rotName = RotationCodes.getRotationName(currentDirection);
			origin = entity.origin;

			if (i + 1 >= path.length) {
				log.msg += ` Ends at x: ${origin.x}, y: ${origin.y}`;
				if (lastDirection != currentDirection) {
					log.msg += ` while facing ${rotName}.`;
				}
				else {
					log.msg += `.`;
				}
			}
			else if (lastDirection != currentDirection) {
				
				log.msg += ` Faces ${rotName} at x: ${origin.x}, y: ${origin.y}.`;
				lastDirection = currentDirection;
			}
			log.describedIDs.push(path[i].uid);
		}

		return log;
	}
}