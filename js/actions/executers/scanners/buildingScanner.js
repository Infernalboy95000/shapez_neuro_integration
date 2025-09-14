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
		const chunks = ViewScanner.getVisibleChunks();
		const limits = ViewScanner.getVisibleLimits();
		const inspections = new Set();
		const skipped = [];

		chunks.forEach((chunk) => {
			const entities = chunk.containedEntitiesByLayer.regular;
			for (let i = 0; i < entities.length; i++) {
				if (!ViewScanner.isBuildingVisible(entities[i]))
					continue;

				result.valid = true;
				if (!inspections.has(entities[i].uid)) {
					const description = BuildingDescriptor.describe(this.#root, entities[i]);
					if (description.msg == "SKIP") {
						skipped.push(entities[i]);
					}
					else {
						if (description.msg != "") {
							result.msg += `${description.msg}\n`;
						}
						inspections.add(entities[i].uid);
						for (let j = 0; j < description.describedIDs.length; j++) {
							inspections.add(description.describedIDs[j]);
						}
					}
				}
			};
		});

		for (let i = 0; i < skipped.length; i++) {
			if (!inspections.has(skipped[i].uid)) {
				const description = BuildingDescriptor.describe(this.#root, skipped[i], true);
				if (description.msg != "") {
					result.msg += `${description.msg}\n`;
				}
			}
		}

		if (!result.valid) {
			result.msg = "No buildings in view.";
		}
		return result;
	}
}