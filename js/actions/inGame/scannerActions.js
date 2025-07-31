import { BaseActions } from "../baseActions";
import { BuildingScanner } from "../executers/scanners/buildingScanner";
import { PatchScanner } from "../executers/scanners/patchScanner";
import { ScanList } from "../lists/inGame/scannerActionList";
import { TutorialChecks } from "../tutorialChecks";

export class ScannerActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {PatchScanner} */ #patchScanner;
	/** @type {BuildingScanner} */ #buildsScanner;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(ScanList.actions);
		super.addCallables(new Map([
			[ScanList.scanTerrain, (e) => { return this.#scanTerrain(e)}],
			[ScanList.scanPatch, (e) => { return this.#tryScanPatch(e)}],
			[ScanList.scanBuildings, (e) => { return this.#scanBuildings(e)}],
		]));

		this.#root = root;
		this.#patchScanner = new PatchScanner(root);
		this.#buildsScanner = new BuildingScanner(root);
	};

	activate() {
		const options = ScanList.getOptions(this.#root);
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
			params[ScanList.xPos], params[ScanList.yPos]
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