import { BaseActions } from "../base/baseActions";
import { MarkersDescriptor } from "../descriptors/pins/markersDescriptor";
import { MarkersPinner } from "../executers/pinners/markersPinner";
import { MarkerActionList } from "../lists/inGame/markerActionList";

export class MarkerActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {MarkersPinner} */ #pinner;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(MarkerActionList.actions);
		super.addCallables(new Map([
			[MarkerActionList.placeMarker, (e) => { return this.#requestNewMarker(e)}],
			[MarkerActionList.goToMarker, (e) => { return this.#tryGoToMarker(e)}],
			[MarkerActionList.editMarker, (e) => { return this.#tryEditMarker(e)}],
		]));

		this.#root = root;
		this.#pinner = new MarkersPinner(root);
	};

	activate() {
		const info = MarkersDescriptor.collectInfo(this.#root);
		const actions = [MarkerActionList.placeMarker];
		if (info.all.length > 0)
			actions.push(MarkerActionList.goToMarker);
		if (info.editable.length > 0)
			actions.push(MarkerActionList.editMarker);

		super.setOptions(MarkerActionList.getOptions(info.all, info.editable));
		super.activate(actions);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#requestNewMarker(params) {
		return this.#pinner.requestNewMarker(
			params[MarkerActionList.xPos], params[MarkerActionList.yPos]
		);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryGoToMarker(params) {
		return this.#pinner.requestTravelToMarker(
			params[MarkerActionList.markerSelect]
		);
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryEditMarker(params) {
		return this.#pinner.requestEditMarker(
			params[MarkerActionList.markerEdit]
		);
	}
}