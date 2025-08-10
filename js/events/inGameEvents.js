import { enumHubGoalRewards } from "shapez/game/tutorial_goals";
import { ActionsCollection } from "../actions/base/actionsCollection";
import { GameCore } from "shapez/game/core";

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
	}

	/** @param {import("shapez/game/root").GameRoot} root */
	updateRoot(root) {
		this.#root = root;
		root.signals.editModeChanged.add(this.#layersSwitched, this);
	}

	//TODO This doesn't work when the player moves the camera slightly with mouse movement or keyboard
	#checkCameraMovement() {
		if (!this.#root || !this.#root.camera) {
			return;
		}

		if (this.#moving) {
			if (!this.#root.camera.viewportWillChange()) {
				this.#moving = false;
				ActionsCollection.activateActions([
					"build", "delete", "scan", "camera"
				]);
			}
		}
		else {
			if (this.#root.camera.viewportWillChange()) {
				this.#moving = true;
				ActionsCollection.deactivateActions([
					"build", "delete", "scan", "camera"
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
}