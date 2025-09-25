import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { ActionsCollection } from "../actions/base/actionsCollection";
import { GameCore } from "shapez/game/core";
import { HUDPinnedShapes } from "shapez/game/hud/parts/pinned_shapes";
import { OverlayEvents } from "./overlayEvents";
import { HUDWaypoints } from "shapez/game/hud/parts/waypoints";
import { MarkersDescriptor } from "../actions/descriptors/pins/markersDescriptor";
import { Vector } from "shapez/core/vector";
import { RandomUtils } from "../custom/randomUtils";
import { DialogEvents } from "./dialogEvents";
import { ModSettings } from "../modSettings";
import { waitNextFrame } from "shapez/core/utils";
import { HUDBlueprintPlacer } from "shapez/game/hud/parts/blueprint_placer";
import { STOP_PROPAGATION } from "shapez/core/signal";
import { InGameState } from "shapez/states/ingame";
import { SdkClient } from "../sdkClient";
import { T } from "shapez/translations";

const ZOOM_TOLERANCE = 1;
const MOVE_TOLERANCE = 3;

export class InGameEvents {
	/** @type {import("../main").NeuroIntegration} */ #mod;
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {number} */ #waitTime = 0;
	/** @type {boolean} */ #moving;
	/** @type {boolean} */ #movingBySdk;
	/** @type {boolean} */ #movingByPlayer;
	/** @type {number} */ #lastZoomLevel;
	/** @type {Vector} */ #lastPosition;

	/** @param {import("../main").NeuroIntegration} mod */
	constructor(mod) {
		this.#mod = mod;
		const thisClass = this;

		mod.modInterface.runAfterMethod(GameCore, "tick",
			function(deltaMs) {
				thisClass.#checkCameraMovement(deltaMs);
				return true;
			}
		);

		mod.modInterface.runAfterMethod(HUDPinnedShapes, "unpinShape",
			function(_) {
				thisClass.#refreshPins();
			}
		)

		mod.modInterface.runAfterMethod(HUDWaypoints, "addWaypoint",
			function(_, __) {
				thisClass.#onMarkersChanged();
			}
		);

		mod.modInterface.runAfterMethod(HUDWaypoints, "renameWaypoint",
			function(_, __) {
				thisClass.#onMarkersChanged();
			}
		);

		mod.modInterface.runAfterMethod(HUDWaypoints, "deleteWaypoint",
			function(_) {
				thisClass.#onMarkersChanged();
			}
		);

		mod.modInterface.runAfterMethod(HUDBlueprintPlacer, "abortPlacement",
			function() {
				thisClass.#onBlueprintCancelled();
				return STOP_PROPAGATION;
			}
		);

		mod.modInterface.runAfterMethod(InGameState, "stageLeavingGame",
			function() {
				thisClass.#onGameExit();
			}
		);
	}

	/** @param {import("shapez/game/root").GameRoot} root */
	updateRoot(root) {
		this.#root = root;
		this.#lastPosition = this.#root.camera.center;
		this.#lastZoomLevel = this.#root.camera.zoomLevel;
		root.signals.editModeChanged.add(this.#layersSwitched, this);
		root.signals.upgradePurchased.add(this.#refreshShop, this);
		root.hud.signals.shapePinRequested.add(this.#refreshPins, this);
		root.hud.signals.buildingsSelectedForCopy.add(this.#onBlueprintCreated, this);
		root.hud.signals.pasteBlueprintRequested.add(this.#onBlueprintPasted, this);
		root.signals.gameSaved.add(this.#onGameSaved, this);
		OverlayEvents.OVERLAYS_CLOSED.add("event_overs_closed", () => { this.#onDialogClosed(); });
		this.#waitTime = 0;
		this.#moving = false;
		this.#movingBySdk = false;
		this.#movingByPlayer = false;
	}

	/** @param {number} deltaMs */
	#checkCameraMovement(deltaMs) {
		if (!this.#root || !this.#root.camera) {
			return;
		}

		if (!this.#moving) {
			if (this.#hasMovedThisFrame()) {
				this.#moving = true;
				ActionsCollection.deactivateActions([
					"build", "delete", "massDelete", "scan", "camera", "marker", "blueprint"
				]);
			}
		}
		else if (this.#hasMovedThisFrame()) {
			this.#waitTime = 0;
		}
		else {
			this.#waitTime += deltaMs;
			if (this.#movingByPlayer) {
				if (this.#waitTime >= ModSettings.get(ModSettings.KEYS.waitAfterHumanTime) * 1000) {
					this.#waitTime = 0;
					this.#moving = false;
					this.#movingByPlayer = false;
					this.#tryRestoreMoveActions();
				}
			}
			else if (this.#movingBySdk) {
				this.#waitTime = 0;
				this.#moving = false;
				this.#movingBySdk = false;
				this.#tryRestoreMoveActions();
			}
		}

		if (!RandomUtils.vectorsEqualAprox(this.#lastPosition, this.#root.camera.center, MOVE_TOLERANCE))
			this.#lastPosition = this.#root.camera.center;

		if (!RandomUtils.numbersEqualAprox(this.#root.camera.zoomLevel, this.#lastZoomLevel, ZOOM_TOLERANCE))
			this.#lastZoomLevel = this.#root.camera.zoomLevel;
	}

	#tryRestoreMoveActions() {
		if (OverlayEvents.currentOverlay == null && !DialogEvents.dialogOpen) {
			ActionsCollection.activateActions([
				"build", "delete", "massDelete", "scan", "camera", "marker", "blueprint"
			]);
		}
	}

	/** @returns {boolean} */
	#hasMovedThisFrame() {
		if (this.#root.camera.desiredCenter !== null || this.#root.camera.desiredZoom !== null) {
			this.#movingBySdk = true;
			return true;
		}

		if (!RandomUtils.vectorsEqualAprox(this.#lastPosition, this.#root.camera.center, MOVE_TOLERANCE)) {
			this.#movingByPlayer = true;
			return true;
		}

		if (!RandomUtils.numbersEqualAprox(this.#root.camera.zoomLevel, this.#lastZoomLevel, ZOOM_TOLERANCE)) {
			this.#movingByPlayer = true;
			return true;
		}
		return false;
	}

	/** @param {Layer} layer */
	#layersSwitched(layer) {
		if (this.#root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_wires_painter_and_levers)) {
			ActionsCollection.deactivateActions(["build", "tools", "blueprint"]);
			ActionsCollection.activateActions(["build", "tools", "blueprint"]);
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

	#refreshBlueprints() {
		waitNextFrame().then(() => {
			if (OverlayEvents.currentOverlay == null && !DialogEvents.dialogOpen) {
				ActionsCollection.deactivateActions(["blueprint"]);
				ActionsCollection.activateActions(["blueprint"]);
			}
		});
	}

	#onDialogClosed() {
		if (OverlayEvents.currentOverlay == null) {
			ActionsCollection.activateActions([
				"pin", "tools", "overlay", "marker", "build",
				"delete", "massDelete", "scan", "camera", "blueprint"
			]);
		}
	}

	#onMarkersChanged() {
		if (this.#root && OverlayEvents.currentOverlay == null && !DialogEvents.dialogOpen)
		{
			MarkersDescriptor.refreshMarkers(this.#root);
			ActionsCollection.deactivateActions(["marker"]);
			ActionsCollection.activateActions(["marker"]);
		}
	}

	#onBlueprintCreated() {
		this.#refreshBlueprints();
	}

	#onBlueprintPasted() {
		this.#refreshBlueprints();
	}

	#onBlueprintCancelled() {
		this.#refreshBlueprints();
	}

	#onGameSaved() {
		SdkClient.sendMessage(T.ingame.notifications.gameSaved, true);
	}

	#onGameExit() {
		ActionsCollection.deactivateActions(["pause"]);
	}
}