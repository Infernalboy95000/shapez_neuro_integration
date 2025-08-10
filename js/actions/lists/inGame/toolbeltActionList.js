import { EnumSchema } from "../../../sdkActions/schema/enumSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";

export class ToolsList {
	static getStats = "get_building_info";
	static wiresLayer = "switch_to_wires_layer";
	static defaultLayer = "switch_to_default_layer";
	static actions = [
		new SdkAction(ToolsList.getStats,
			"Get all the information of one of your available builds, like what it does and it's work speed."
		),
		new SdkAction(ToolsList.wiresLayer,
			"Switch to the wires layer. Allows to build logic buildings that can be placed under normal buildings."
		),
		new SdkAction(ToolsList.defaultLayer,
			"Switch to the default layer. Allows to build your normal buildings and hides the wires from view."
		),
	];

	static build = "building";

	/**
	 * @param {Array<string>} buildNames
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(buildNames) {
		const options = {
			[ToolsList.build]: new EnumSchema(ToolsList.build, buildNames),
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
				ToolsList.getStats, [
					options[ToolsList.build]
				]
			]
		]);
	}
}