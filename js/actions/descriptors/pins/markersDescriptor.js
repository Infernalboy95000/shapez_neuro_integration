import { HUDWaypoints } from "shapez/game/hud/parts/waypoints";

export class MarkersDescriptor {
	/** @type {Map<string, import("shapez/game/hud/parts/waypoints").Waypoint>} */
	static #waypoints = new Map();

	/** @param {import("shapez/game/root").GameRoot} root */
	static refreshMarkers(root) {
		this.#waypoints.clear();
		/** @type {HUDWaypoints} */ //@ts-ignore
		const waypointsMenu =  root.hud.parts.waypoints;
		const waypointsList = waypointsMenu.waypoints;
		let duplicates = 2;

		for (let i = 0; i < waypointsList.length; i++) {
			let originalLabel = waypointsList[i].label;
			let label = waypointsMenu.getWaypointLabel(waypointsList[i]);

			while (this.#waypoints.has(label)) {
				label = `${originalLabel} ${duplicates}`;
				duplicates++;
			}
			this.#waypoints.set(label, waypointsList[i]);
		}
	}

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @returns {{all:Array<string>, editable:Array<string>}}
	 */
	static collectInfo(root) {
		/** @type {HUDWaypoints} */ //@ts-ignore
		const waypointsMenu = root.hud.parts.waypoints;
		const info = {all: [], editable: []}

		this.#waypoints.forEach((waypoint, key) => {
			info.all.push(key);
			if (waypointsMenu.isWaypointDeletable(waypoint))
				info.editable.push(key);
		})

		return info;
	}

	/**
	 * @param {string} markerName
	 * @returns {{valid:boolean, marker:import("shapez/game/hud/parts/waypoints").Waypoint}}
	 * */
	static checkMarker(markerName) {
		const result = {
			valid: this.#waypoints.has(markerName),
			marker: null
		}
		if (result.valid) {
			result.marker = this.#waypoints.get(markerName);
		}

		return result;
	}
}