import { formatBigNumber, getRomanNumber } from "shapez/core/utils";
import { HUDShop } from "shapez/game/hud/parts/shop";
import { T } from "shapez/translations";

export class UpgradesDescriptor {
	/**
	 * @param {import("shapez/game/root").GameRoot} root
	 * @param {string} filter
	 * @returns {string}
	 * */
	static getInfo(root, filter = "") {
		/** @type {HUDShop} */
		const shop = root.hud.parts.shop;
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
				//const shapeDef = root.shapeDefinitionMgr.getShapeFromShortKey(shape);
				const have = root.hubGoals.getShapesStoredByKey(shape);
				msg += `\r\nYou have ${have} out of ${amount} required shapes with code: ${shape}`;
			});
		}

		return msg;
	}
}