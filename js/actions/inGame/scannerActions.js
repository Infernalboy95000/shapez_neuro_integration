import { BaseActions } from "../base/baseActions";
import { BuildingScanner } from "../executers/scanners/buildingScanner";
import { PatchScanner } from "../executers/scanners/patchScanner";
import { ScannerActionList } from "../lists/inGame/scannerActionList";
import { TutorialChecks } from "../../helpers/tutorialChecks";
import { ModSettings } from "../../modSettings";
import { SdkClient } from "../../sdkClient";

export class ScannerActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {PatchScanner} */ #patchScanner;
	/** @type {BuildingScanner} */ #buildsScanner;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(ScannerActionList.actions);
		super.addCallables(new Map([
			[ScannerActionList.scanTerrain, (e) => { return this.#scanTerrain()}],
			[ScannerActionList.scanPatch, (e) => { return this.#tryScanPatch(e)}],
			[ScannerActionList.scanBuildings, (e) => { return this.#scanBuildings()}],
		]));

		this.#root = root;
		this.#patchScanner = new PatchScanner(root);
		this.#buildsScanner = new BuildingScanner(root);
	};

	activate() {
		if (!ModSettings.get(ModSettings.KEYS.descriptiveActions)) { return; }
		const options = ScannerActionList.getOptions();
		super.setOptions(options);
		super.activate();

		if (TutorialChecks.scanned && TutorialChecks.buildingScanned)
		{
			SdkClient.sendMessage(
				`Auto scanning visible zone:\n` +
				`Terrain information: ${this.#scanTerrain().msg}` +
				`Buildings information: ${this.#scanBuildings().msg}`, true
			)
		}
	}

	/** @returns {{valid:boolean, msg:string}} */
	#scanTerrain() {
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

	/** @returns {{valid:boolean, msg:string}} */
	#scanBuildings() {
		TutorialChecks.buildingScanned = true;
		return this.#buildsScanner.scanInView();
	}
}