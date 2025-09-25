import { EntityComponentStorage } from "shapez/game/entity_components";
import { RotationCodes } from "../../shapes/rotationCodes";
import { Entity } from "shapez/game/entity";
import { StaticEntityInfo } from "../staticEntityInfo";
import { BeltComponent } from "shapez/game/components/belt";
import { BaseItem } from "shapez/game/base_item";
import { ColorItem } from "shapez/game/items/color_item";
import { ShapeItem } from "shapez/game/items/shape_item";
import { ShapeCode } from "../../shapes/shapeCode";
import { ColorCodes } from "../../shapes/colorCodes";
import { ViewScanner } from "../../camera/viewScanner";

export class BeltInfo {
	/** @type {boolean} */ static #beltCutted = false;

	/**
	 * @param {EntityComponentStorage} belt
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 * */
	static describe(belt) {
		this.#beltCutted = false;
		let log = {msg:"", describedIDs:new Array()};
		const path = belt.Belt.assignedPath.entityPath;
		if (path.length > 1) {
			log = this.#describePath(path);
		}
		else {
			const entity = belt.StaticMapEntity;
			const rotName = RotationCodes.getRotationName(entity.originalRotation);
			log.msg = `It's facing ${rotName}.`;
		}

		let connected;
		if (!this.#beltCutted) {
			connected = belt.Belt.assignedPath.boundAcceptor;
			if (connected) {
				const acceptor = belt.Belt.assignedPath.computeAcceptingEntityAndSlot().entity;
				log.msg += ` It's connected to ${StaticEntityInfo.simple(acceptor.components.StaticMapEntity)}.`
			}
			else {
				log.msg += " It's not connected to any building.";
			}
		}

		if (belt.Belt.assignedPath.items.length > 0) {
			log.msg += " It contains "
			const info = this.#countItems(belt.Belt);
			let count = 0;
			info.items.forEach((itemMap) => {
				if (itemMap.item instanceof ColorItem) {
					log.msg += `${itemMap.count} ${ColorCodes.describe(itemMap.item.color)}`
				}
				else if (itemMap.item instanceof ShapeItem) {
					log.msg += `${itemMap.count} ${ShapeCode.describe(itemMap.item.definition)}`
					if (itemMap.count > 1)
						log.msg += "s";
				}
				else {
					log.msg += `${itemMap.count} unknown pieces`
				}
				count += 1;
				if (count < info.items.size)
					log.msg += ", ";
			});
			log.msg += "."

			if (info.full) {
				log.msg += " It's full of items."
				if (connected)
					log.msg += " Maybe the connected machine is too slow or it's stuck."
			}
		}
		else {
			log.msg += " It's empty."
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
		log.msg = `Found belt line starting it's path at: ` +
		`x: ${origin.x}, y: ${origin.y} facing ${dirName}.`;

		let lastDirection = path[0].components.StaticMapEntity.originalRotation;
		for (let i = 0; i < path.length; i++) {
			if (!ViewScanner.isBuildingVisible(path[i])) {
				this.#beltCutted = true;
				log.msg += ` Continues outside of view.`;
				break;
			}
			const entity = path[i].components.StaticMapEntity;
			const currentDirection = entity.originalRotation;
			const rotName = RotationCodes.getRotationName(currentDirection);
			const altDir = entity.rotation;
			const rotRot = RotationCodes.getRotationName(altDir);
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
			else if (lastDirection != altDir) {
				log.msg += ` Faces ${rotRot} at x: ${origin.x}, y: ${origin.y}.`;
				lastDirection = altDir;
			}
			log.describedIDs.push(path[i].uid);
		}

		return log;
	}

	/**
	 * @param {BeltComponent} belt
	 * @returns {{items:Map<String, {item:BaseItem, count:Number}>, full:boolean}}
	 * */
	static #countItems(belt) {
		/** @type {Map<String, {item:BaseItem, count:Number}>} */
		const itemsMap = new Map();
		let spacing = 0;

		for (let i = 0; i < belt.assignedPath.items.length; i++) {
			const item = belt.assignedPath.items[i];
			const key = item[1].getAsCopyableKey();
			let itemMap;
			if (itemsMap.has(key)) {
				itemMap = itemsMap.get(key);
				itemMap.count += 1;
			}
			else {
				itemMap = {item:item[1], count:1}
			}
			itemsMap.set(key, itemMap);
			spacing += item[0];
		}

		const itemsSpace = spacing + belt.assignedPath.numCompressedItemsAfterFirstItem;

		return {items:itemsMap, full:(itemsSpace >= belt.assignedPath.totalLength)};
	}
}