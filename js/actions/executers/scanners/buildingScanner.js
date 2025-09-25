import { T } from "shapez/translations";
import { BuildingDescriptor } from "../../descriptors/buildings/buildingDescriptor";
import { ViewScanner } from "../../descriptors/camera/viewScanner";

export class BuildingScanner {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {Map<number, string>} */ #aproxNumbers = new Map();
	
	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		this.#aproxNumbers.set(1, "one");
		this.#aproxNumbers.set(10, "a few");
		this.#aproxNumbers.set(25, "some");
		this.#aproxNumbers.set(50, "lots of");
	};

	/** @returns {{valid:boolean, msg:string}} */
	scanInView() {
		const result = {valid: false, msg: ""};
		const chunks = ViewScanner.getVisibleChunks();
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
						result.msg += `${description.msg}`;
						inspections.add(entities[i].uid);
						for (let j = 0; j < description.describedIDs.length; j++) {
							inspections.add(description.describedIDs[j]);
						}

						if (description.msg != "" && i + 1 < entities.length)
							result.msg += "\n";
					}
				}
			};
		});

		for (let i = 0; i < skipped.length; i++) {
			if (!inspections.has(skipped[i].uid)) {
				const description = BuildingDescriptor.describe(this.#root, skipped[i], true);
				result.msg += `${description.msg}`;

				if (description.msg != "" && i + 1 < skipped.length)
					result.msg += "\n";
			}
		}

		if (!result.valid) {
			result.msg = "No buildings in view.";
		}
		return result;
	}

	/** @returns {{valid:boolean, msg:string}} */
	scanInOverview() {
		const result = {valid: false, msg: ""};
		const chunks = ViewScanner.getVisibleChunks();
		const inspections = new Set();
		/** @type {Map<string, number>} */
		const scanned = new Map();

		chunks.forEach((chunk) => {
			scanned.clear();
			const entities = chunk.containedEntitiesByLayer.regular;
			for (let i = 0; i < entities.length; i++) {
				if (!ViewScanner.isBuildingVisible(entities[i]))
					continue;

				result.valid = true;
				if (!inspections.has(entities[i].uid)) {
					const id = entities[i].components.StaticMapEntity.getMetaBuilding().getId();
					let count = 0;
					if (scanned.has(id))
						count = scanned.get(id);
					scanned.set(id, count + 1)
					inspections.add(entities[i].uid);
				}
			};

			if (scanned.size > 0)
				result.msg += `\nFound `;

			let scans = 0;
			scanned.forEach((count, buildName) => {
				if (buildName == "hub")
					result.msg += "the hub";
				else {
					const translatedName = T.buildings[buildName]["default"].name;
					result.msg += `${this.#aproximateNumber(count)} ${translatedName.toLowerCase()}`;
					if (count > 1) {
						if (translatedName == "switch")
							result.msg += "es";
						else if (translatedName != "trash" && translatedName != "compare")
							result.msg += "s";
					}
				}

				scans += 1;
				if (scanned.size > 1 && scans + 1 == scanned.size)
					result.msg += ` and `;
				else if (scans < scanned.size)
					result.msg += `, `;
				else
					result.msg += ` arround x: ${chunk.tileX}, ${chunk.tileY}.`;
			})
		});

		return result;
	}

	/**
	 * @param {number} count
	 * @returns {string}
	 * */
	#aproximateNumber(count) {
		let found = false;
		let msg = "quite a lot of";
		this.#aproxNumbers.forEach((numName, numValue) => {
			if (found) { return; }

			if (count <= numValue) {
				msg = numName;
				found = true;
			}
		});
		return msg;
	}
}