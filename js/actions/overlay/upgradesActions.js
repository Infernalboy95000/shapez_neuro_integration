import { BaseActions } from "../base/baseActions";
import { GoalsDescriptor } from "../descriptors/pins/goalsDescriptor";
import { UpgradesPanelController } from "../executers/overlays/upgradesPanelController";
import { ShapesPinner } from "../executers/pinners/shapesPinner";
import { UpgradesActionList } from "../lists/overlays/upgradesActionList";

export class UpgradesActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {UpgradesPanelController} */ #panel;
	/** @type {ShapesPinner} */ #pinner;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(UpgradesActionList.actions);
		super.addCallables(new Map([
			[UpgradesActionList.getInfo, (e) => { return this.#tryGetInfo(e)}],
			[UpgradesActionList.upgrade, (e) => { return this.#tryUpgrade(e)}],
			[UpgradesActionList.pinShape, (e) => { return this.#tryPinShape(e)}],
			[UpgradesActionList.unpinShape, (e) => { return this.#tryUnpinShape(e)}],
			[UpgradesActionList.shapeInfo, (e) => { return this.#tryGetShapeInfo(e)}],
			[UpgradesActionList.close, () => { return this.#closeMenu()}],
		]));

		this.#root = root;
		this.#panel = new UpgradesPanelController(root);
		this.#pinner = new ShapesPinner(root);
	};

	activate() {
		const compile = GoalsDescriptor.compileInfo(this.#root);
		const options = UpgradesActionList.getOptions(
			compile.boosts, compile.full, compile.pin, compile.unpin, compile.goal
		);
		super.setOptions(options);
		const actions = [UpgradesActionList.getInfo, UpgradesActionList.shapeInfo, UpgradesActionList.close];
		if (compile.full.length > 0)
			actions.push(UpgradesActionList.upgrade);

		if (compile.pin.length > 0)
			actions.push(UpgradesActionList.pinShape);

		if (compile.unpin.length > 0)
			actions.push(UpgradesActionList.unpinShape);
		super.activate(actions);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryGetInfo(params) {
		return this.#panel.getInfo(params[UpgradesActionList.boost]);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryUpgrade(params) {
		return this.#panel.tryUpgrade(params[UpgradesActionList.upBoost]);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryPinShape(params) {
		const result = this.#panel.tryShowAsPinned(params[UpgradesActionList.shapeToPin]);
		if (result.valid) {
			return this.#pinner.tryPinShape(params[UpgradesActionList.shapeToPin]);
		}
		return result;
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryUnpinShape(params) {
		const result = this.#panel.tryShowAsUnpinned(params[UpgradesActionList.shapeToUnpin]);
		if (result.valid) {
			return this.#pinner.tryUnpinShape(params[UpgradesActionList.shapeToUnpin]);
		}
		return result;
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryGetShapeInfo(params) {
		return this.#pinner.fullyDescribeShape(params[UpgradesActionList.shape]);
	}

	/** @returns {{valid:boolean, msg:string}} */
	#closeMenu() {
		this.#panel.closePanel();
		return {valid: true, msg: "Upgrade menu closed"};
	}
}