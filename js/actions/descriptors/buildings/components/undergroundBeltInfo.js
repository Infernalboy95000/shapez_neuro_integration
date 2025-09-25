import { EntityComponentStorage } from "shapez/game/entity_components";

export class UndergroundBeltInfo {
	/**
	 * @param {EntityComponentStorage} components
	 * @returns {{msg:string, describedIDs:Array<number>}}
	 */
	static describe(components, force = false) {
		const log = {msg:"", describedIDs:new Array()};
		const tunnel = components.UndergroundBelt;
		if (!force && tunnel.mode == "receiver") {
			log.msg = "SKIP";
		}
		else if (tunnel.cachedLinkedEntity.entity != null) {
			log.msg = this.#tryDescribeReceiver(tunnel.cachedLinkedEntity);
			log.describedIDs.push(tunnel.cachedLinkedEntity.entity.uid);
		}
		else {
			log.msg = "It's not connected to another tunnel."
		}

		return log;
	}

	/**
	 * @param {import("shapez/game/components/underground_belt").LinkedUndergroundBelt} receiver
	 * @returns {string}
	*/
	static #tryDescribeReceiver(receiver) {
		const entity = receiver.entity;
		const origin = entity.components.StaticMapEntity.origin;
		let msg = `It's connected to a tunnel ${receiver.distance} tiles away, ` +
		`at ${origin.x}, ${origin.y}.`;

		return msg;
	}
}