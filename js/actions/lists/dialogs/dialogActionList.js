import { EnumSchema } from "../../../sdkActions/schema/enumSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { StringSchema } from "../../../sdkActions/schema/stringSchema";
import { SdkAction } from "../../../sdkActions/sdkAction";

export class DialogActionList {
	static read = "read_notification"
	static writeText = "type_text";
	static chooseOption = "choose_option";
	static actions = [
		new SdkAction(DialogActionList.read,
			"Read the current dialog text."
		),
		new SdkAction(DialogActionList.writeText,
			"Write some text at the curent field."
		),
		new SdkAction(DialogActionList.chooseOption,
			"Choose the desired option."
		),
	];

	static option = "option";
	static text = "text";

	/**
	 * @param {Array<string>} optionsArray
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(optionsArray) {
		const options = {
			[this.option]:new EnumSchema(this.option, optionsArray),
			[this.text]:new StringSchema(this.text, 0, 256)
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
				],
			],
			[
				this.writeText, [
					options[this.text],
				]
			]
		]);
	}
}