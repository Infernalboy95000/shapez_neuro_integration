import { OverlayEvents } from "../../events/overlayEvents";
import { BaseActions } from "../base/baseActions";
import { GoalsDescriptor } from "../descriptors/pins/goalsDescriptor";
import { ShapeInfoActionList } from "../lists/overlays/shapeInfoActionList";

export class ShapeInfoActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(ShapeInfoActionList.actions);
		super.addCallables(new Map([
			[ShapeInfoActionList.layersInfo, () => { return this.#tryGetInfo()}],
			[ShapeInfoActionList.close, () => { return this.#closeMenu()}],
		]));

		this.#root = root;
	};

	/** @returns {{valid:boolean, msg:string}} */
	#tryGetInfo() {
		const shape = OverlayEvents.lastShapeDescribed;
		const result = {valid: true, msg: ""};
		result.msg = GoalsDescriptor.fullyDescribeShape(shape);
		return result;
	}

	/** @returns {{valid:boolean, msg:string}} */
	#closeMenu() {
		// @ts-ignore
		this.#root.hud.parts.shapeViewer.close();
		return {valid: true, msg: "Upgrade panel closed"};
	}
}