import { ColorCodes } from "../shapes/colorCodes";
import { ShapeCode } from "../shapes/shapeCode";

export class SignalDescriptor
{
	/**
	 * @param {import("shapez/core/global_registries").BaseItem} item
	 * @returns {string}
	 */
	static Describe(item) {
		let desc = ""
		const key = item.getAsCopyableKey();
		switch (item.getItemType()) {
			case "shape":
				// @ts-ignore
				desc = ShapeCode.describe(item.definition);
				break;
			case "color":
				desc = ColorCodes.describe(key);
				break;
			case "boolean":
				desc = key;
		}
		return desc;
	}
}