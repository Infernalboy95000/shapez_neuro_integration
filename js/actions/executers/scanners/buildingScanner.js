import { BuildingDescriptor } from "../../descriptors/buildings/buildingDescriptor";
import { ViewScanner } from "../../descriptors/camera/viewScanner";

export class BuildingScanner {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	
	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
	};

	/** @returns {{valid:boolean, msg:string}} */
	scanInView() {
		const result = {valid: false, msg: ""};
		const chunks = ViewScanner.getVisibleChunks(this.#root);
		const inspections = new Set();

		chunks.forEach((chunk) => {
			const entities = chunk.containedEntitiesByLayer.regular;
			for (let i = 0; i < entities.length; i++) {
				result.valid = true;
				if (!inspections.has(entities[i].uid)) {
					const description = BuildingDescriptor.describe(this.#root, entities[i]);
					inspections.add(entities[i].uid);
					result.msg += description.msg;
					
					for (let j = 0; j < description.describedIDs.length; j++) {
						inspections.add(description.describedIDs[j]);
					}
				}

				if (i + 1 < entities.length) {
					result.msg += "\r\n";
				}
			};
		});

		if (!result.valid) {
			result.msg = "No buildings in view.";
		}
		return result;
	}
}