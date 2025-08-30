import { RandomUtils } from "../../../custom/randomUtils";
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
				desc = ShapeCode.describe(key);
				break;
			case "color":
				desc = RandomUtils.capitalizeFirst(key);
				break;
			case "boolean":
				desc = key;
		}
		return desc;
	}
}