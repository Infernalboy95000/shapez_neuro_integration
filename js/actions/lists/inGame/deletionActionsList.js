import { NumberSchema } from "../../../sdkActions/schema/numberSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";
import { ViewScanner } from "../../descriptors/camera/viewScanner";

export class DeletionActionList {
	static deleteBuild = "delete_building";
	static actions = [
		new SdkAction(
			"delete_building", "Delete an already placed building in the map."
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
			[this.xPos]:
			new NumberSchema(this.xPos, 1, limits.x, limits.x + limits.w - 1),
			[this.yPos]:
			new NumberSchema(this.yPos, 1, limits.y, limits.y + limits.h - 1),
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
				this.deleteBuild, [
					options[this.xPos], options[this.yPos],
				]
			]
		]);
	}
}