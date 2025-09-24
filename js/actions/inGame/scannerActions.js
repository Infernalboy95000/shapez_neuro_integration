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
	/** @type {boolean} */ #overview = false;

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

		let msg = "";
		if (!this.#overview && this.#root.camera.getIsMapOverlayActive()) {
			msg += `Entered overview mode. You cannot build and text descriptions are a lot simpler. ` +
			`Zoom closer if you wish to enable those actions again.`
			this.#overview = true;
		}

		if (this.#overview && !this.#root.camera.getIsMapOverlayActive()) {
			msg += `Exited overview mode. All functions are available again.`
			this.#overview = false;
		}

		if (
			ModSettings.get(ModSettings.KEYS.descriptiveActions) &&
			TutorialChecks.scanned && TutorialChecks.buildingScanned
		)
		{
			msg += `Auto scanning visible zone:\n` +
				`Terrain information:${this.#scanTerrain().msg}\n` +
				`Buildings information:${this.#scanBuildings().msg}`;
		}

		if (msg != "")
			SdkClient.sendMessage(msg, true);
	}

	/** @returns {{valid:boolean, msg:string}} */
	#scanTerrain() {
		TutorialChecks.scanned = true;
		if (this.#root.camera.getIsMapOverlayActive())
			return this.#patchScanner.scanInOverview();
		else
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
		if (this.#root.camera.getIsMapOverlayActive())
			return this.#buildsScanner.scanInOverview();
		else
			return this.#buildsScanner.scanInView();
	}
}