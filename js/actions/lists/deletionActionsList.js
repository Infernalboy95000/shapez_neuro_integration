import { NumberSchema } from "../../sdkActions/schema/numberSchema";
import { SchemaBase } from "../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../sdkActions/sdkAction";
import { ViewScanner } from "../descriptors/camera/viewScanner";

export class DelList {
	static deleteBuild = "delete_building";
	static deleteArea = "delete_in_area";
	static actions = [
		new SdkAction(
			"delete_building", "Delete an already placed building in the map."
		),
		new SdkAction(
			"delete_in_area", "Delete all buildings in an square area you choose."
		)
	];

	static xPos = "x";
	static yPos = "y";
	static lowLeft_xPos = "low_left_corner_x";
	static lowLeft_yPos = "low_left_corner_y";
	static upRight_xPos = "upper_right_corner_x";
	static upRight_yPos = "upper_right_corner_y";

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(root) {
		const limits = ViewScanner.getVisibleLimits(root);
		const options = {
			[DelList.xPos]:
			new NumberSchema(DelList.xPos, 1, limits.x, limits.x + limits.w - 1),
			[DelList.yPos]:
			new NumberSchema(DelList.yPos, 1, limits.y, limits.y + limits.h - 1),

			[DelList.lowLeft_xPos]:
			new NumberSchema(DelList.lowLeft_xPos, 1, limits.x, limits.x + limits.w - 1),
			[DelList.lowLeft_yPos]:
			new NumberSchema(DelList.lowLeft_yPos, 1, limits.y, limits.y + limits.h - 1),

			[DelList.upRight_xPos]:
			new NumberSchema(DelList.upRight_xPos, 1, limits.x, limits.x + limits.w - 1),
			[DelList.upRight_yPos]:
			new NumberSchema(DelList.upRight_yPos, 1, limits.y, limits.y + limits.h - 1),
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
				DelList.deleteBuild, [
					options[DelList.xPos], options[DelList.yPos],
				]
			],
			[
				DelList.deleteArea, [
					options[DelList.lowLeft_xPos], options[DelList.lowLeft_yPos],
					options[DelList.upRight_xPos], options[DelList.upRight_yPos],
				]
			]
		]);
	}
}