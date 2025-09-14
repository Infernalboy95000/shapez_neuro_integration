import { BoolSchema } from "../../../sdkActions/schema/boolSchema";
import { EnumSchema } from "../../../sdkActions/schema/enumSchema";
import { NumberSchema } from "../../../sdkActions/schema/numberSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";
import { ViewScanner } from "../../descriptors/camera/viewScanner";
import { RotationCodes } from "../../descriptors/shapes/rotationCodes";

export class PlacementActionList {
	static placeBuild = "place_building";
	static placeBuildLine = "place_line_of_buildings";
	static beltPlanner = "use_belt_planner";
	static actions = [
		new SdkAction(this.placeBuild,
			"Select and place a building from your toolbelt."
		),
		new SdkAction(this.placeBuildLine,
			"Place an entire straight line of buildings at once."
		),
		new SdkAction(this.beltPlanner,
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
	 * @param {Array<string>} buildNames
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(buildNames) {
		const limits = ViewScanner.getVisibleLimits();
		const rotNames = RotationCodes.getCodes();
		const options = {
			[this.build]: new EnumSchema(this.build, buildNames),
			[this.endHorizontal]: new BoolSchema(this.endHorizontal),
			[this.rot]: new EnumSchema(this.rot, rotNames),
			[this.dir]: new EnumSchema(this.dir, rotNames),
			[this.lineLength]: new NumberSchema(this.lineLength, 1, 2, limits.w),

			[this.xPos]:
			new NumberSchema(this.xPos, 1, limits.x, limits.x + limits.w - 1),
			[this.yPos]:
			new NumberSchema(this.yPos, 1, limits.y, limits.y + limits.h - 1),

			[this.xPos1]:
			new NumberSchema(this.xPos1, 1, limits.x, limits.x + limits.w - 1),
			[this.yPos1]:
			new NumberSchema(this.yPos1, 1, limits.y, limits.y + limits.h - 1),

			[this.xPos2]:
			new NumberSchema(this.xPos2, 1, limits.x, limits.x + limits.w - 1),
			[this.yPos2]:
			new NumberSchema(this.yPos2, 1, limits.y, limits.y + limits.h - 1),
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
				this.placeBuild, [
					options[this.build],
					options[this.xPos], options[this.yPos],
					options[this.rot]
				]
			],
			[
				this.placeBuildLine, [
					options[this.build],
					options[this.xPos], options[this.yPos],
					options[this.rot], options[this.dir],
					options[this.lineLength]
				]
			],
			[
				this.beltPlanner, [
					options[this.xPos1], options[this.yPos1],
					options[this.xPos2], options[this.yPos2],
					options[this.endHorizontal],
				]
			],
		]);
	}
}