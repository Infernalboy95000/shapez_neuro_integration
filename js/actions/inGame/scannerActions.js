import { BaseActions } from "../base/baseActions";
import { BuildingScanner } from "../executers/scanners/buildingScanner";
import { PatchScanner } from "../executers/scanners/patchScanner";
import { ScannerActionList } from "../lists/inGame/scannerActionList";
import { TutorialChecks } from "../../helpers/tutorialChecks";

export class ScannerActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {PatchScanner} */ #patchScanner;
	/** @type {BuildingScanner} */ #buildsScanner;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(ScannerActionList.actions);
		super.addCallables(new Map([
			[ScannerActionList.scanTerrain, (e) => { return this.#scanTerrain(e)}],
			[ScannerActionList.scanPatch, (e) => { return this.#tryScanPatch(e)}],
			[ScannerActionList.scanBuildings, (e) => { return this.#scanBuildings(e)}],
		]));

		this.#root = root;
		this.#patchScanner = new PatchScanner(root);
		this.#buildsScanner = new BuildingScanner(root);
	};

	activate() {
		const options = ScannerActionList.getOptions(this.#root);
		super.setOptions(options);
		super.activate();
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#scanTerrain(params) {
		TutorialChecks.scanned = true;
		return this.#patchScanner.scanInView();
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#tryScanPatch(params) {
		TutorialChecks.deepScanned = true;
		return this.#patchScanner.scanAt(
			params[ScannerActionList.xPos], params[ScannerActionList.yPos]
		)
	}

	/**
	 * @param {Object} params
	 * @returns {{valid:boolean, msg:string}}
	*/
	#scanBuildings(params) {
		TutorialChecks.buildingScanned = true;
		return this.#buildsScanner.scanInView();
	}
}