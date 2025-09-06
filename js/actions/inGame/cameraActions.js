import { BaseActions } from "../base/baseActions";
import { CameraMover } from "../executers/camera/cameraMover";
import { CameraActionList } from "../lists/inGame/cameraActionList";

export class CameraActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {CameraMover} */ #cameraMover;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(CameraActionList.actions);
		super.addCallables(new Map([
			[CameraActionList.move, (e) => { return this.#tryMoveCamera(e)}],
			[CameraActionList.zoom, (e) => { return this.#tryZoomCamera(e)}],
		]));

		this.#root = root;
		this.#cameraMover = new CameraMover(root);
	};

	activate() {
		const options = CameraActionList.getOptions(this.#root);
		super.setOptions(options);
		super.activate();
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryMoveCamera(params) {
		return this.#cameraMover.move(
			params[CameraActionList.xPos], params[CameraActionList.yPos]
		)
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryZoomCamera(params) {
		return this.#cameraMover.zoom(
			params[CameraActionList.zoomLevel]
		)
	}
}