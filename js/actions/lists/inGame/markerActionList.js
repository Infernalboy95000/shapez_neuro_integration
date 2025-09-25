import { EnumSchema } from "../../../sdkActions/schema/enumSchema";
import { NumberSchema } from "../../../sdkActions/schema/numberSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";
import { ViewScanner } from "../../descriptors/camera/viewScanner";

export class MarkerActionList {
	static placeMarker = "place_marker";
	static goToMarker = "go_to_marker";
	static editMarker = "edit_marker";
	static actions = [
		new SdkAction(
			this.placeMarker, "Place a marker on a certain position."
		),
		new SdkAction(
			this.goToMarker, "Move to a previously placed marker."
		),
		new SdkAction(
			this.editMarker, "Edit or delete a previously marker."
		),
	];

	static xPos = "x";
	static yPos = "y";
	static markerSelect = "marker";
	static markerEdit = "marker_to_edit";

	/**
	 * @param {Array<string>} all
	 * @param {Array<string>} editable
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(all, editable) {
		const limits = ViewScanner.getVisibleLimits();
		const options = {
			[this.xPos]:
			new NumberSchema(this.xPos, limits.x, limits.x + limits.w - 1),
			[this.yPos]:
			new NumberSchema(this.yPos, limits.y, limits.y + limits.h - 1),
			[this.markerSelect]:
			new EnumSchema(this.markerSelect, all),
			[this.markerEdit]:
			new EnumSchema(this.markerEdit, editable),
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
				this.placeMarker, [
					options[this.xPos], options[this.yPos],
				]
			],
			[
				this.goToMarker, [
					options[this.markerSelect],
				]
			],
			[
				this.editMarker, [
					options[this.markerEdit],
				]
			]
		]);
	}
}