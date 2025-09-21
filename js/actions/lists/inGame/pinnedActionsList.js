import { EnumSchema } from "../../../sdkActions/schema/enumSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";

export class PinnedActionsList {
	static goal = "show_current_goal";
	static pinned = "list_pinned_shapes";
	static unpinShape = "unpin_shape";
	static shapeInfo = "get_shape_details";
	static actions = [
		new SdkAction(this.goal,
			"Describe what's the current shape you have to deliver to the HUB in order to get to the next level."
		),
		new SdkAction(this.pinned,
			"Get the list of shapes you have pinned. Those are related to upgrade goals."
		),
		new SdkAction(this.shapeInfo,
			"Get all the details of a shape from your pinned shapes."
		),
		new SdkAction(this.unpinShape,
			"Unpin a shape from your pinned list."
		),
	];

	static shape = "shape";
	static shapeToUnpin = "shape_to_unpin";

	/**
	 * @param {Array<string>} shapesToUnpin
	 * @param {string} goal
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(shapesToUnpin, goal) {
		const shapes = Array.from(shapesToUnpin);
		shapes.push(goal);
		const options = {
			[this.shape]: new EnumSchema(this.shape, shapes),
			[this.shapeToUnpin]: new EnumSchema(this.shapeToUnpin, shapesToUnpin),
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
				this.unpinShape, [
					options[this.shapeToUnpin]
				],
			],
			[
				this.shapeInfo, [
					options[this.shape]
				]
			]
		]);
	}
}