import { MapChunkView } from "shapez/game/map_chunk_view";
import { EntityComponentStorage } from "shapez/game/entity_components";
import { RotationCodes } from "./rotationCodes";
import { Entity } from "shapez/game/entity";
import { Vector } from "shapez/core/vector";

export class BuildingDescriptor {
	/** @type {MapChunkView} */ #chunk

	/** @param {MapChunkView} chunk */ 
	constructor(chunk) {
		this.#chunk = chunk;
	}

	/** @returns {Map<number, {name:string, entity:EntityComponentStorage, inspected:boolean}>} */
	get() {
		const buildingsMap = new Map();
		const buildings = this.#chunk.containedEntitiesByLayer.regular;
		for (let i = 0; i < buildings.length; i++) {
			buildingsMap.set(
				buildings[i].uid,
				this.#formatBuilding(buildings[i].components)
			);
		}

		return buildingsMap;
	}

	/**
	 * @param {Number} id
	 * @param {EntityComponentStorage} building
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static describe(id, building) {
		const buildingName = building.StaticMapEntity.getMetaBuilding().getId();
		switch (buildingName) {
			case "belt":
				return this.#describeBelt(id, building);
			case "miner":
				return this.#describeMiner(id, building);
			case "hub":
				return this.#describeHub(id, building);
			default:
				return {msg:"Unknown building", describedIDs:new Array()};
		}
	}

	/**
	 * @param {Number} id
	 * @param {EntityComponentStorage} belt
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static #describeBelt(id, belt) {
		let log = {msg:"", describedIDs:new Array()};
		const path = belt.Belt.assignedPath.entityPath;
		if (path.length > 1) {
			log = this.#describeBeltPath(path);
		}
		else {
			const entity = belt.StaticMapEntity;
			const origin = entity.origin;
			const rotName = RotationCodes.getRotationName(entity.rotation);
			log.msg = `Found belt at x: ${origin.x}, y: ${origin.y} ` + 
			`facing ${rotName}`;
			log.describedIDs.push(id);
		}

		return log;
	}

	/**
	 * @param {Entity[]} path
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static #describeBeltPath(path) {
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

	/**
	 * @param {Number} id
	 * @param {EntityComponentStorage} miner
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static #describeMiner(id, miner) {
		const log = {msg:"", describedIDs:new Array()};
		const origin = miner.StaticMapEntity.origin;
		const currentDirection = miner.StaticMapEntity.originalRotation;
		const rotName = RotationCodes.getRotationName(currentDirection);
		log.msg = `Found miner at x: ${origin.x}, y: ${origin.y} ` +
		`facing ${rotName}`;
		log.describedIDs.push(id);

		return log;
	}

	/**
	 * @param {Number} id
	 * @param {EntityComponentStorage} hub
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static #describeHub(id, hub) {
		/** @type {Map<string, Array<Vector>>} */
		const slotsByDir = new Map();
		const log = {msg:"", describedIDs:new Array()};
		const origin = hub.StaticMapEntity.origin;
		const slots = hub.ItemAcceptor.slots;
		log.describedIDs.push(id);

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

	/**
	 * @param {EntityComponentStorage} component
	 * @returns {{name:string, entity:EntityComponentStorage, inspected:boolean}}
	 * */
	#formatBuilding(component) {
		const building = component.StaticMapEntity.getMetaBuilding();

		return {
			name: building.getId(),
			entity: component,
			inspected: false
		}
	}
}