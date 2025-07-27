import { NumberSchema } from "../../sdkActions/schema/numberSchema";
import { SchemaBase } from "../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../sdkActions/sdkAction";
import { ViewScanner } from "../descriptors/camera/viewScanner";

export class CamList {
	static move = "move_camera";
	static zoom = "change_zoom";
	static actions = [
		new SdkAction(CamList.move,
			"Move the camera at a nearby position."
		),
		new SdkAction(CamList.zoom,
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
			[CamList.xPos]:
			new NumberSchema(CamList.xPos, 1, limits.x, limits.x + limits.w - 1),
			[CamList.yPos]:
			new NumberSchema(CamList.yPos, 1, limits.y, limits.y + limits.h - 1),

			[CamList.zoomLevel]:
			new NumberSchema(CamList.zoomLevel, 1, minZoom, maxZoom),
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
				CamList.move, [
					options[CamList.xPos], options[CamList.yPos],
				]
			],
			[
				CamList.zoom, [
					options[CamList.zoomLevel]
				]
			]
		]);
	}
}