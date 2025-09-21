import { NumberSchema } from "../../../sdkActions/schema/numberSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";
import { ViewScanner } from "../../descriptors/camera/viewScanner";

export class MassDeleteActionList {
	static deleteArea = "delete_in_area";
	static actions = [
		new SdkAction(
			this.deleteArea, "Delete all buildings in an square area you choose."
		)
	];

	static lowLeft_xPos = "low_left_corner_x";
	static lowLeft_yPos = "low_left_corner_y";
	static upRight_xPos = "upper_right_corner_x";
	static upRight_yPos = "upper_right_corner_y";

	/** @returns {Map<string, Array<SchemaBase>>} */
	static getOptions() {
		const limits = ViewScanner.getVisibleLimits();
		const options = {
			[this.lowLeft_xPos]:
			new NumberSchema(this.lowLeft_xPos, 1, limits.x, limits.x + limits.w - 1),
			[this.lowLeft_yPos]:
			new NumberSchema(this.lowLeft_yPos, 1, limits.y, limits.y + limits.h - 1),

			[this.upRight_xPos]:
			new NumberSchema(this.upRight_xPos, 1, limits.x, limits.x + limits.w - 1),
			[this.upRight_yPos]:
			new NumberSchema(this.upRight_yPos, 1, limits.y, limits.y + limits.h - 1),
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
				this.deleteArea, [
					options[this.lowLeft_xPos], options[this.lowLeft_yPos],
					options[this.upRight_xPos], options[this.upRight_yPos],
				]
			]
		]);
	}
}