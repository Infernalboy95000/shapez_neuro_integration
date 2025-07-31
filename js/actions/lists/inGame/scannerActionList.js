import { NumberSchema } from "../../../sdkActions/schema/numberSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";
import { ViewScanner } from "../../descriptors/camera/viewScanner";

export class ScanList {
	static scanTerrain = "scan_terrain";
	static scanPatch = "scan_patch";
	static scanBuildings = "scan_buildings";
	static actions = [
		new SdkAction(
			"scan_terrain", "See if there's patches currently in view."
		),
		new SdkAction(
			"scan_patch", "Fully describe all positions that compose a patch. Scanning terrain first might help you find them."
		),
		new SdkAction(
			"scan_buildings", "Fully describe all buildings in view."
		)
	];

	static xPos = "x";
	static yPos = "y";

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(root) {
		const limits = ViewScanner.getVisibleLimits(root);
		const options = {
			[ScanList.xPos]:
			new NumberSchema(ScanList.xPos, 1, limits.x, limits.x + limits.w - 1),
			[ScanList.yPos]:
			new NumberSchema(ScanList.yPos, 1, limits.y, limits.y + limits.h - 1),
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
				ScanList.scanPatch, [
					options[ScanList.xPos], options[ScanList.yPos],
				]
			]
		]);
	}
}