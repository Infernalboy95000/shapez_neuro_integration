import { NumberSchema } from "../../../sdkActions/schema/numberSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";
import { ViewScanner } from "../../descriptors/camera/viewScanner";

export class ScannerActionList {
	static scanTerrain = "scan_terrain";
	static scanPatch = "scan_patch";
	static scanBuildings = "scan_buildings";
	static actions = [
		new SdkAction(
			this.scanTerrain, "See if there's patches currently in view."
		),
		new SdkAction(
			this.scanPatch, "Fully describe all positions that compose a patch. Scanning terrain first might help you find them."
		),
		new SdkAction(
			this.scanBuildings, "Fully describe all buildings in view."
		)
	];

	static xPos = "x";
	static yPos = "y";

	/** @returns {Map<string, Array<SchemaBase>>} */
	static getOptions() {
		const limits = ViewScanner.getVisibleLimits();
		const options = {
			[this.xPos]:
			new NumberSchema(this.xPos, limits.x, limits.x + limits.w - 1),
			[this.yPos]:
			new NumberSchema(this.yPos, limits.y, limits.y + limits.h - 1),
		};
		return this.#mapOptions(options);
	}

	/**
	 * @param {Object} options
	 * @returns {Map<string, Array<SchemaBase>>}
	 */
	static #mapOptions(options) {
		return new Map([
			[
				this.scanPatch, [
					options[this.xPos], options[this.yPos],
				]
			]
		]);
	}
}