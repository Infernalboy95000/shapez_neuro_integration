import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { ActionsCollection } from "../actions/base/actionsCollection";
import { GameCore } from "shapez/game/core";
import { HUDPinnedShapes } from "shapez/game/hud/parts/pinned_shapes";
import { OverlayEvents } from "./overlayEvents";

export class InGameEvents {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {boolean} */ #moving;

	/** @param {import("../main").NeuroIntegration} mod */
	constructor(mod) {
		const thisClass = this;

		mod.modInterface.runAfterMethod(GameCore, "tick",
			function(deltaMs) {
				thisClass.#checkCameraMovement();
				return true;
			}
		);

		mod.modInterface.runAfterMethod(HUDPinnedShapes, "unpinShape",
			function(_) {
				thisClass.#refreshPins();
			}
		)
	}

	/** @param {import("shapez/game/root").GameRoot} root */
	updateRoot(root) {
		this.#root = root;
		root.signals.editModeChanged.add(this.#layersSwitched, this);
		root.signals.upgradePurchased.add(this.#refreshShop, this);
		root.hud.signals.shapePinRequested.add(this.#refreshPins, this);
		OverlayEvents.OVERLAYS_CLOSED.add("event_overs_closed", () => { this.#onDialogClosed(); });
	}

	#restoreGameActions() {
		if (this.#root.camera.getIsMapOverlayActive()) {
			ActionsCollection.activateActions([
				"massDelete", "scan", "camera"
			]);
		}
		else {
			ActionsCollection.activateActions([
				"build", "delete", "massDelete", "scan", "camera"
			]);
		}
	}

	//TODO This doesn't work when the player moves the camera slightly with mouse movement or keyboard
	#checkCameraMovement() {
		if (!this.#root || !this.#root.camera) {
			return;
		}

		if (this.#moving) {
			if (!this.#root.camera.viewportWillChange()) {
				this.#moving = false;
				this.#restoreGameActions();
			}
		}
		else {
			if (this.#root.camera.viewportWillChange()) {
				this.#moving = true;
				ActionsCollection.deactivateActions([
					"build", "delete", "massDelete", "scan", "camera"
				]);
			}
		}
	}

	/** @param {Layer} layer */
	#layersSwitched(layer) {
		if (this.#root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_wires_painter_and_levers)) {
			ActionsCollection.deactivateActions(["build", "tools"]);
			ActionsCollection.activateActions(["build", "tools"]);
		}
	}

	#refreshPins() {
		if (OverlayEvents.currentOverlay == "shop") {
			ActionsCollection.deactivateActions(["shop"]);
			ActionsCollection.activateActions(["shop"]);
		}
		else {
			ActionsCollection.deactivateActions(["pin"]);
			ActionsCollection.activateActions(["pin"]);
		}
	}

	#refreshShop() {
		if (OverlayEvents.currentOverlay == "shop") {
			ActionsCollection.deactivateActions(["shop"]);
			ActionsCollection.activateActions(["shop"]);
		}
	}

	#onDialogClosed() {
		ActionsCollection.activateActions(["pin", "tools", "overlay"]);
		this.#restoreGameActions();
	}
}