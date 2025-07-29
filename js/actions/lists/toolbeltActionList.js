import { EnumSchema } from "../../sdkActions/schema/enumSchema";
import { SchemaBase } from "../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../sdkActions/sdkAction";

export class ToolsList {
	static getStats = "get_building_info";
	static actions = [
		new SdkAction(ToolsList.getStats,
			"Get all the information of one of your available builds, like what it does and it's work speed."
		)
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