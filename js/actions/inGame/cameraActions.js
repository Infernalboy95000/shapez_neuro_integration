import { BaseActions } from "../base/baseActions";
import { CameraMover } from "../executers/camera/cameraMover";
import { CamList } from "../lists/inGame/cameraActionList";

export class CameraActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {CameraMover} */ #cameraMover;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(CamList.actions);
		super.addCallables(new Map([
			[CamList.move, (e) => { return this.#tryMoveCamera(e)}],
			[CamList.zoom, (e) => { return this.#tryZoomCamera(e)}],
		]));

		this.#root = root;
		this.#cameraMover = new CameraMover(root);
	};

	activate() {
		const options = CamList.getOptions(this.#root);
		super.setOptions(options);
		super.activate();
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryMoveCamera(params) {
		return this.#cameraMover.move(
			params[CamList.xPos], params[CamList.yPos]
		)
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryZoomCamera(params) {
		return this.#cameraMover.zoom(
			params[CamList.zoomLevel]
		)
	}
}