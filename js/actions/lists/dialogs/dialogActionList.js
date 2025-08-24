import { EnumSchema } from "../../../sdkActions/schema/enumSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";

export class DialogActionList {
	static read = "read_notification"
	static chooseOption = "choose_option";
	static actions = [
		new SdkAction(DialogActionList.read,
			"Read the current dialog text."
		),
		new SdkAction(DialogActionList.chooseOption,
			"Choose the desired option."
		),
	];

	static option = "option";

	/**
	 * @param {Array<string>} optionsArray
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(optionsArray) {
		const options = {
			[this.option]:
			new EnumSchema(this.option, optionsArray),
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
				this.chooseOption, [
					options[this.option],
				]
			]
		]);
	}
}