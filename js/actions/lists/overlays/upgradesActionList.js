import { EnumSchema } from "../../../sdkActions/schema/enumSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";

export class UpgradesActionList {
	static getInfo = "get_upgrades_info";
	static upgrade = "upgrade";
	static pinShape = "pin_shape";
	static unpinShape = "unpin_shape";
	static shapeInfo = "get_shape_details";
	static close = "close_upgrades_menu";
	static actions = [
		new SdkAction(this.getInfo,
			"Get all the upgrade(s) information, like their required shapes."
		),
		new SdkAction(this.upgrade,
			"Upgrade a certain upgrade."
		),
		new SdkAction(this.pinShape,
			"Pin a shape from a certain upgrade."
		),
		new SdkAction(this.unpinShape,
			"Unpin a shape from a certain upgrade."
		),
		new SdkAction(this.shapeInfo,
			"Get all the details of a shape from an upgrade."
		),
		new SdkAction(this.close,
			"Close the upgrades menu."
		)
	];

	static boost = "upgrade";
	static upBoost = "upgrade_to_lvl_up";
	static shape = "shape";
	static shapeToPin = "shape_to_pin";
	static shapeToUnpin = "shape_to_unpin";

	/**
	 * @param {Array<string>} boosts
	 * @param {Array<string>} upBoosts
	 * @param {Array<string>} shapesToPin
	 * @param {Array<string>} shapesToUnpin
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(boosts, upBoosts, shapesToPin, shapesToUnpin) {
		const shapes = shapesToPin.concat(shapesToUnpin);
		const options = {
			[this.boost]: new EnumSchema(this.boost, boosts),
			[this.upBoost]: new EnumSchema(this.upBoost, upBoosts),
			[this.shape]: new EnumSchema(this.shape, shapes),
			[this.shapeToPin]: new EnumSchema(this.shapeToPin, shapesToPin),
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
				this.getInfo, [
					options[this.boost]
				]
			],
			[
				this.upgrade, [
					options[this.upBoost]
				],
			],
			[
				this.pinShape, [
					options[this.shapeToPin]
				],
			],
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