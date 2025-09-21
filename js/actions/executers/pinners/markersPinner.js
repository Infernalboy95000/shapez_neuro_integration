import { Vector } from "shapez/core/vector";
import { HUDWaypoints } from "shapez/game/hud/parts/waypoints";
import { MarkersDescriptor } from "../../descriptors/pins/markersDescriptor";
import { globalConfig } from "shapez/core/config";

export class MarkersPinner {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {HUDWaypoints} */ #waypoints;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		//@ts-ignore
		this.#waypoints = this.#root.hud.parts.waypoints;
		MarkersDescriptor.refreshMarkers(root);
	}

	/**
	 * @param {number} posX
	 * @param {number} posY
	 * @returns {{valid:boolean, msg:string}}
	 */
	requestNewMarker(posX, posY) {
		const worldPos = new Vector(posX, posY).toWorldSpace();
		worldPos.x += globalConfig.halfTileSize;
		worldPos.y += globalConfig.halfTileSize;
		this.#waypoints.requestSaveMarker({ worldPos });
		return {valid:true, msg:"Marker requested."};
	}

	/**
	 * @param {string} waypointName
	 * @returns {{valid:boolean, msg:string}}
	 */
	requestEditMarker(waypointName) {
		const result = {valid:false, msg:"That marker doesn't exist."};
		const response = MarkersDescriptor.checkMarker(waypointName);
		if (response.valid) {
			result.valid = true;
			result.msg = "Prompting to modify the marker.";
			const waypoint = response.marker;
			this.#waypoints.requestSaveMarker({ waypoint });
		}
		return result;
	}

	/**
	 * @param {string} waypointName
	 * @returns {{valid:boolean, msg:string}}
	 */
	requestTravelToMarker(waypointName) {
		const result = {valid:false, msg:"That marker doesn't exist."};
		const response = MarkersDescriptor.checkMarker(waypointName);
		if (response.valid) {
			const center = this.#root.camera.center;
			const markerCenter = new Vector(response.marker.center.x, response.marker.center.y);
			if (this.#isTooClose(center, markerCenter)) {
				result.msg = `You're already at that marker's position.`;
			}
			else {
				result.valid = true;
				result.msg = "Travelling to marker.";
				this.#waypoints.moveToWaypoint(response.marker);
			}
		}
		return result;
	}

	/**
	 * @param {Vector} from
	 * @param {Vector} to
	 * @returns {boolean}
	*/
	#isTooClose(from, to) {
		if (from.distance(to) >= globalConfig.halfTileSize) {
			return false;
		}
		return true;
	}
}