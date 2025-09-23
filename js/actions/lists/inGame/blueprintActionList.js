import { EnumSchema } from "../../../sdkActions/schema/enumSchema";
import { NumberSchema } from "../../../sdkActions/schema/numberSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";
import { ViewScanner } from "../../descriptors/camera/viewScanner";
import { RotationCodes } from "../../descriptors/shapes/rotationCodes";

export class BlueprintActionList {
	static copyArea = "copy_area";
	static cutArea = "cut_area";
	static pasteBlueprint = "paste_blueprint";
	static getBlueprintCost = "get_blueprint_cost";
	static clearBlueprint = "clear_blueprint";
	static actions = [
		new SdkAction(this.copyArea,
			"Copy all buildings in an square area you choose. Those will convert into a blueprint you can paste later."
		),
		new SdkAction(this.cutArea,
			"Cut all buildings in an square area you choose. Those will convert into a blueprint you can paste later."
		),
		new SdkAction(this.pasteBlueprint,
			"Paste the current blueprint in a certain position and direction."
		),
		new SdkAction(this.getBlueprintCost,
			"Get the cost of the current blueprint in pieces."
		),
		new SdkAction(this.clearBlueprint,
			"Clear the current blueprint."
		)
	];

	static xPos = "x";
	static yPos = "y";
	static lowLeft_xPos = "low_left_corner_x";
	static lowLeft_yPos = "low_left_corner_y";
	static upRight_xPos = "upper_right_corner_x";
	static upRight_yPos = "upper_right_corner_y";
	static rot = "rotation";

	/** @returns {Map<string, Array<SchemaBase>>} */
	static getOptions() {
		const limits = ViewScanner.getVisibleLimits();
		const rotNames = RotationCodes.getCodes();
		const options = {
			[this.rot]: new EnumSchema(this.rot, rotNames),

			[this.xPos]:
			new NumberSchema(this.xPos, limits.x, limits.x + limits.w - 1),
			[this.yPos]:
			new NumberSchema(this.yPos, limits.y, limits.y + limits.h - 1),

			[this.lowLeft_xPos]:
			new NumberSchema(this.lowLeft_xPos, limits.x, limits.x + limits.w - 1),
			[this.lowLeft_yPos]:
			new NumberSchema(this.lowLeft_yPos, limits.y, limits.y + limits.h - 1),

			[this.upRight_xPos]:
			new NumberSchema(this.upRight_xPos, limits.x, limits.x + limits.w - 1),
			[this.upRight_yPos]:
			new NumberSchema(this.upRight_yPos, limits.y, limits.y + limits.h - 1),
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
				this.copyArea, [
					options[this.lowLeft_xPos], options[this.lowLeft_yPos],
					options[this.upRight_xPos], options[this.upRight_yPos],
				]
			],
			[
				this.cutArea, [
					options[this.lowLeft_xPos], options[this.lowLeft_yPos],
					options[this.upRight_xPos], options[this.upRight_yPos],
				]
			],
			[
				this.pasteBlueprint, [
					options[this.xPos], options[this.yPos],
					options[this.rot],
				]
			],
		]);
	}
}