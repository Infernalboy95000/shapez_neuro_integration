import { HUDShop } from "shapez/game/hud/parts/shop";
import { UpgradesDescriptor } from "../../descriptors/overlays/upgradesDescriptor";
import { T } from "shapez/translations";
import { SOUNDS } from "shapez/platform/sound";

/** Gives entire controll over the upgrades panel*/
export class UpgradesPanelController {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {HUDShop} */ #shop;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		// @ts-ignore
		this.#shop = root.hud.parts.shop;
	}
	
	/**
	 * @param {string} upgrade
	 * @returns {{valid:boolean, msg:string}}
	 * */
	getInfo(upgrade) {
		const result = {valid:false, msg:"Upgrade doesn't exist."};
		let id = "";
		if (upgrade == "all" || upgrade == "") {
			result.valid = true;
		}
		else {
			id = this.#tryGetUpgradeID(upgrade);
			if (id != "") {
				result.valid = true;
			}
		}

		if (result.valid) {
			result.msg = UpgradesDescriptor.getInfo(this.#root, id);
		}
		return result;
	}

	/** @returns {{boosts:Array<string>, full:Array<string>, pin:Array<string>, unpin:Array<string>}} */
	compileInfo() {
		const compile = { boosts:["all"], full:[], pin:[], unpin: [] };
		const upgrades = this.#root.gameMode.getUpgrades();
		const currentGoalShape = this.#root.hubGoals.currentGoal.definition.getHash();
		for (const [id, _] of Object.entries(upgrades)) {
			compile.boosts.push(T.shopUpgrades[id].name);
			const tiers = upgrades[id];
			const tier = this.#root.hubGoals.getUpgradeLevel(id);
			const tierHandle = tiers[tier];
			let full = true;
			tierHandle.required.forEach(({ shape, amount }) => {
				const have = this.#root.hubGoals.getShapesStoredByKey(shape);
				if (currentGoalShape != shape) {
					// @ts-ignore
					if (this.#root.hud.parts.pinnedShapes.isShapePinned(shape)) {
						compile.unpin.push(shape);
					}
					else {
						compile.pin.push(shape);
					}
				}

				if (have < amount) {
					full = false;
				}
			});

			if (full) {
				compile.full.push(T.shopUpgrades[id].name)
			}
		}
		return compile;
	}

	/**
	 * @param {string} upgrade
	 * @returns {{valid:boolean, msg:string}}
	 */
	tryUpgrade(upgrade) {
		const result = {valid:false, msg:"Upgrade doesn't exist."};
		const id = this.#tryGetUpgradeID(upgrade);
		if (id != null) {
			result.valid = this.#root.hubGoals.tryUnlockUpgrade(id);
			if (result.valid) {
				result.msg = "Upgrade successfull!";
				this.#root.app.sound.playUiSound(SOUNDS.unlockUpgrade);
			}
			else {
				result.msg = "Cannot afford upgrade.";
			}
		}
		return result;
	}

	/**
	 * @param {string} shapeCode
	 * @returns {{valid:boolean, msg:string}}
	 */
	tryShowAsPinned(shapeCode) {
		const result = this.#tryGetPinnedShape(shapeCode);
		if (result.valid) {
			UpgradesDescriptor.showAsPinned(shapeCode);
		}
		return result;
	}

	/**
	 * @param {string} shapeCode
	 * @returns {{valid:boolean, msg:string}}
	 */
	tryShowAsUnpinned(shapeCode) {
		const result = this.#tryGetPinnedShape(shapeCode);
		if (result.valid) {
			UpgradesDescriptor.showAsUnpinned(shapeCode);
		}
		return result;
	}

	closePanel() {
		this.#shop.close();
	}

	/**
	 * @param {string} upgradeName
	 * @returns {string}
	*/
	#tryGetUpgradeID(upgradeName) {
		const upgrades = this.#root.gameMode.getUpgrades();
		for (const [id, _] of Object.entries(upgrades)) {
			const displayName = T.shopUpgrades[id].name;
			if (upgradeName == displayName) {
				return id;
			}
		}
		return "";
	}

	/**
	 * @param {string} shapeCode
	 * @returns {{valid:boolean, msg:string}}
	 */
	#tryGetPinnedShape(shapeCode) {
		const result = {valid:false, msg:"shape is not on the upgrades list."};
		if (UpgradesDescriptor.getPinForShape(shapeCode)) {
			result.valid = true;
		}
		return result;
	}
}