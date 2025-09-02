import { formatBigNumber, getRomanNumber } from "shapez/core/utils";
import { HUDShop } from "shapez/game/hud/parts/shop";
import { T } from "shapez/translations";

export class UpgradesDescriptor {
	/** @type {Map<string, HTMLButtonElement>} */
	static #pinButtons = new Map();

	static clearPins() {
		this.#pinButtons.clear();
	}

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {string} shapeCode
	 * @returns {HTMLButtonElement}
	 * */
	static getPinForShape(root, shapeCode) {
		if (this.#pinButtons.size <= 0)
			UpgradesDescriptor.getInfo(root);
		return this.#pinButtons.get(shapeCode);
	}

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {string} shapeCode
	 * @returns {boolean}
	 * */
	static showAsPinned(root, shapeCode) {
		const button = this.getPinForShape(root, shapeCode);
		if (button) {
			button.classList.add("pinned");
			button.classList.remove("unpinned");
			return true;
		}
		return false;
	}

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {string} shapeCode
	 * @returns {boolean}
	 * */
	static showAsUnpinned(root, shapeCode) {
		const button = this.getPinForShape(root, shapeCode);
		if (button) {
			button.classList.add("unpinned");
			button.classList.remove("pinned", "alreadyPinned");
			return true;
		}
		return false;
	}

	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {string} filter
	 * @returns {string}
	 * */
	static getInfo(root, filter = "") {
		/** @type {HUDShop} */
		// @ts-ignore
		const shop = root.hud.parts.shop;
		const pins = this.#collectPins();
		let currentPin = 0;

		let msg = "";
		const upgrades = root.gameMode.getUpgrades();
		for (const id in shop.upgradeToElements) {
			if (filter != "" && id != filter) {
				continue;
			}

			const tiers = upgrades[id];
			const tier = root.hubGoals.getUpgradeLevel(id);
			const tierMult = root.hubGoals.upgradeImprovements[id];
			const tierHandle = tiers[tier];

			const tierStr = getRomanNumber(tier + 1);
			const tierMultStr = formatBigNumber(tierMult);
			const currMultStr = tierMult.toFixed(2);
			const newMultStr = (tierMult + tierHandle.improvement).toFixed(2);

			msg += `\r\nUpgrade ${T.shopUpgrades[id].name} is at tier ${tier + 1}.` +
				`\r\nRight now, it provides with x${currMultStr} boost.` +
				`\r\nShapes required to upgrade to x${newMultStr} boost:`;

			tierHandle.required.forEach(({ shape, amount }) => {
				if (pins.length > currentPin) {
					this.#pinButtons.set(shape, pins[currentPin]);
					currentPin += 1;
				}

				const have = root.hubGoals.getShapesStoredByKey(shape);
				msg += `\r\nYou have ${have} out of ${amount} required shapes with code: ${shape}`;
			});
		}

		return msg;
	}

	/** @returns {Array<HTMLButtonElement>} */
	static #collectPins() {
		let buttons = [];
		const shop = document.getElementById("ingame_HUD_Shop");
		if (shop) {
			shop.querySelectorAll('button.pin').forEach((value) => {
				buttons.push(value);
			});
		}
		return buttons;
	}
}