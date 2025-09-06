import { NumberSchema } from "../../../sdkActions/schema/numberSchema";
import { SchemaBase } from "../../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../../sdkActions/sdkAction";
import { ViewScanner } from "../../descriptors/camera/viewScanner";

export class CameraActionList {
	static move = "move_camera";
	static zoom = "change_zoom";
	static actions = [
		new SdkAction(this.move,
			"Move the camera at a nearby position."
		),
		new SdkAction(this.zoom,
			"Adjust your current camera zoom. If you zoom far enough, you will enter map overwiew mode."
		)
	];

	static xPos = "x";
	static yPos = "y";
	static zoomLevel = "zoom_percent";

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(root) {
		const limits = ViewScanner.getVisibleLimits(root).allScaled(2);
		const minZoom = Math.round(root.camera.getMinimumZoom() * 100);
		const maxZoom = Math.round(root.camera.getMaximumZoom() * 100);
		const options = {
			[this.xPos]:
			new NumberSchema(this.xPos, 1, limits.x, limits.x + limits.w - 1),
			[this.yPos]:
			new NumberSchema(this.yPos, 1, limits.y, limits.y + limits.h - 1),

			[this.zoomLevel]:
			new NumberSchema(this.zoomLevel, 1, minZoom, maxZoom),
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
				this.move, [
					options[this.xPos], options[this.yPos],
				]
			],
			[
				this.zoom, [
					options[this.zoomLevel]
				]
			]
		]);
	}
}