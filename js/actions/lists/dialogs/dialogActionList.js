import { EnumSchema } from "../../../sdkActions/schema/enumSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { StringSchema } from "../../../sdkActions/schema/stringSchema";
import { SdkAction } from "../../../sdkActions/sdkAction";

export class DialogActionList {
	static read = "read_text"
	static writeText = "write_text";
	static setSignal = "set_signal";
	static pressButton = "press_button";
	static closeWindow = "close_window";
	static actions = [
		new SdkAction(DialogActionList.read,
			"Read the current window text."
		),
		new SdkAction(DialogActionList.writeText,
			"Write some text at the curent field."
		),
		new SdkAction(DialogActionList.setSignal,
			"Set a signal from the pre-defined ones."
		),
		new SdkAction(DialogActionList.pressButton,
			"Press the button you want."
		),
		new SdkAction(DialogActionList.closeWindow,
			"Close the current window."
		),
	];

	static button = "button";
	static signal = "signal";
	static text = "text";

	/**
	 * @param {Array<string>} buttons
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(buttons, signals) {
		const options = {
			[this.button]:new EnumSchema(this.button, buttons),
			[this.signal]:new EnumSchema(this.signal, signals),
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
				this.pressButton, [
					options[this.button],
				],
			],
			[
				this.setSignal, [
					options[this.signal],
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