import { MapChunkView } from "shapez/game/map_chunk_view";
import { PatchDescriptor } from "../helpers/patchDescriptor";
import { Vector } from "shapez/core/vector";
import { RandomUtils } from "../../custom/randomUtils";
import { BuildingDescriptor } from "../helpers/buildingDescriptor";
import { EntityComponentStorage } from "shapez/game/entity_components";

export class MapDescriptor {
	/** @type {import("shapez/mods/mod").Mod} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {Map<string, PatchDescriptor>} */ #patches;
	/** @type {Map<string, BuildingDescriptor>} */ #buildings;

	/**
	 * @param {import("shapez/mods/mod").Mod} mod
	 * @param {import("shapez/game/root").GameRoot} root
	 */
	constructor(mod, root) {
		this.#mod = mod;
		this.#root = root;
	}

	// Scans for nearby patches
	/** @returns {string} */
	scanNearbyPatches() {
		this.#patches = this.#getPatchDescriptors(this.#getVisibleChunks());
		return this.#simplePatchDescriptior(this.#patches);
	}

	/**
	 * @param {Vector} pos 
	 * @returns {string}
	 */
	fullyDescribePatch(pos) {
		if (!this.#patches) {
			this.scanNearbyPatches();
		}
		
		const chunk = this.#getChunkOnPosition(pos);
		if (chunk == null) {
			return `Sorry. There's no terrain generated at x: ${pos.x}, y: ${pos.y} yet. Move closer to create it.`;
		}
		else {
			const formattedPos = RandomUtils.formatPosition(chunk.x, chunk.y);
			if (this.#patches.has(formattedPos)) {
				const PatchDescriptor = this.#patches.get(formattedPos);
				return PatchDescriptor.advanced(pos);
			}
			else {
				return `Sorry. There're no patches nearby x:${pos.x}, y:${pos.y}`;
			}
		}
	}

	/** @returns {string} */
	scanBuildingsInView() {
		this.#scanNearbyBuildings();
		return this.#simpleBuildingsDescriptior(this.#buildings);
	}

	#scanNearbyBuildings() {
		this.#buildings = this.#getBuildingDescriptors(this.#getVisibleChunks());
	}

	/**
	 * @param {Map<string, PatchDescriptor>} chunks
	 * @returns {string}
	 * */
	#simplePatchDescriptior(chunks) {
		let msg = "";
		chunks.forEach(chunk => {
			msg += chunk.simple();
			msg += "\r\n";
		});

		if (msg == "") {
			msg = "No patches found here.";
		}
		return msg;
	}

	/**
	 * @param {Map<string, BuildingDescriptor>} chunks
	 * @returns {string}
	 * */
	#simpleBuildingsDescriptior(chunks) {
		const allBuildings = this.#recompileAllBuildings(chunks);
		const usedIDs = new Array();

		let msg = "No buildings in view.";
		allBuildings.forEach((building, key) => {
			if (usedIDs.includes(key)) {
				return; // This acts as a "continue"
			}
			const log = BuildingDescriptor.describe(key, building.entity);
			msg += `\n${log.msg}`;

			for (let i = 0; i < log.describedIDs.length; i++) {
				if (!usedIDs.includes(log.describedIDs[i])) {
					usedIDs.push(log.describedIDs[i]);
				}
			}
		});
		return msg;
	}

	/**
	 * @param {Map<string, BuildingDescriptor>} chunks
	 * @returns {Map<number, {name:string, entity:EntityComponentStorage, inspected:boolean}>}
	 * */
	#recompileAllBuildings(chunks) {
		const allBuildings = new Map();

		chunks.forEach(chunk => {
			const chunkBuildings = chunk.get();
			chunkBuildings.forEach((building, key) => {
				allBuildings.set(key, building);
			});
		});

		return allBuildings;
	}

	/**
	 * @param {Map<string, MapChunkView>} chunks
	 * @returns {Map<string, PatchDescriptor>}
	 * */
	#getPatchDescriptors(chunks) {
		/** @type {Map<string, PatchDescriptor>} */
		const finds = new Map();
		chunks.forEach((chunk, key) => {
			if (chunk.patches.length > 0) {
				finds.set(key, new PatchDescriptor(chunk));
			}
		});
		return finds;
	}

	/**
	 * @param {Map<string, MapChunkView>} chunks
	 * @returns {Map<string, BuildingDescriptor>}
	 * */
	#getBuildingDescriptors(chunks) {
		/** @type {Map<string, BuildingDescriptor>} */
		const finds = new Map();

		chunks.forEach((chunk, key) => {
			if (chunk.containedEntitiesByLayer.regular.length > 0) {
				finds.set(key, new BuildingDescriptor(chunk));
			}
		});
		return finds;
	}

	/** @returns {Map<string, MapChunkView>} */
	#getVisibleChunks() {
		const chunks = this.#root.map.chunksById;
		/** @type {Map<string, MapChunkView>} */
		const visibleChunks = new Map();

		chunks.forEach((chunk, key) => {
			if (this.#isChunkVisible(chunk)) {
				visibleChunks.set(key, chunk);
			}
		});

		return visibleChunks;
	}

	/**
	 * @param {MapChunkView} chunk
	 * @returns {boolean} */
	#isChunkVisible(chunk) {
		const visible = this.#root.camera.getVisibleRect();
		return visible.containsRect(chunk.worldSpaceRectangle);
	}

	/**
	 * @param {Vector} pos 
	 * @returns {MapChunkView}
	 */
	#getChunkOnPosition(pos) {
		return this.#root.map.getChunkAtTileOrNull(pos.x, pos.y);
	}
}