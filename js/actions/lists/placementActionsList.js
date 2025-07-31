import { BoolSchema } from "../../sdkActions/schema/boolSchema";
import { EnumSchema } from "../../sdkActions/schema/enumSchema";
import { NumberSchema } from "../../sdkActions/schema/numberSchema";
import { SchemaBase } from "../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../sdkActions/sdkAction";
import { ViewScanner } from "../descriptors/camera/viewScanner";

export class PlaceList {
	static placeBuild = "place_building";
	static placeBuildLine = "place_line_of_buildings";
	static beltPlanner = "use_belt_planner";
	static actions = [
		new SdkAction(PlaceList.placeBuild,
			"Select and place a building from your toolbelt."
		),
		new SdkAction(PlaceList.placeBuildLine,
			"Place an entire straight line of buildings at once."
		),
		new SdkAction(PlaceList.beltPlanner,
			"Place belts from one point to the other, in an 'L' shaped path."
		)
	];

	static build = "building";
	static xPos = "x";
	static yPos = "y";
	static xPos1 = "x1";
	static yPos1 = "y1";
	static xPos2 = "x2";
	static yPos2 = "y2";
	static endHorizontal = "end_horizontal";
	static rot = "rotation";
	static dir = "direction";
	static lineLength = "line_length";

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {Array<string>} buildNames
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(root, buildNames) {
		const limits = ViewScanner.getVisibleLimits(root);
		const rotNames = ["UP", "DOWN", "LEFT", "RIGHT"];
		const options = {
			[PlaceList.build]: new EnumSchema(PlaceList.build, buildNames),
			[PlaceList.endHorizontal]: new BoolSchema(PlaceList.endHorizontal),
			[PlaceList.rot]: new EnumSchema(PlaceList.rot, rotNames),
			[PlaceList.dir]: new EnumSchema(PlaceList.dir, rotNames),
			[PlaceList.lineLength]: new NumberSchema(PlaceList.lineLength, 1, 2, limits.w),

			[PlaceList.xPos]:
			new NumberSchema(PlaceList.xPos, 1, limits.x, limits.x + limits.w - 1),
			[PlaceList.yPos]:
			new NumberSchema(PlaceList.yPos, 1, limits.y, limits.y + limits.h - 1),

			[PlaceList.xPos1]:
			new NumberSchema(PlaceList.xPos1, 1, limits.x, limits.x + limits.w - 1),
			[PlaceList.yPos1]:
			new NumberSchema(PlaceList.yPos1, 1, limits.y, limits.y + limits.h - 1),

			[PlaceList.xPos2]:
			new NumberSchema(PlaceList.xPos2, 1, limits.x, limits.x + limits.w - 1),
			[PlaceList.yPos2]:
			new NumberSchema(PlaceList.yPos2, 1, limits.y, limits.y + limits.h - 1),
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
				PlaceList.placeBuild, [
					options[PlaceList.build],
					options[PlaceList.xPos], options[PlaceList.yPos],
					options[PlaceList.rot]
				]
			],
			[
				PlaceList.placeBuildLine, [
					options[PlaceList.build],
					options[PlaceList.xPos], options[PlaceList.yPos],
					options[PlaceList.rot], options[PlaceList.dir],
					options[PlaceList.lineLength]
				]
			],
			[
				PlaceList.beltPlanner, [
					options[PlaceList.xPos1], options[PlaceList.yPos1],
					options[PlaceList.xPos2], options[PlaceList.yPos2],
					options[PlaceList.endHorizontal],
				]
			],
		]);
	}
}