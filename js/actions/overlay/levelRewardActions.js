import { HUDUnlockNotification } from "shapez/game/hud/parts/unlock_notification";
import { BaseActions } from "../base/baseActions";
import { LevelRewardActionList } from "../lists/overlays/levelRewardActionList";

export class LevelRewardActions extends BaseActions {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	
	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		super(LevelRewardActionList.actions);
		super.addCallables(new Map([
			[LevelRewardActionList.close, () => { return this.#closeMenu()}],
		]));

		this.#root = root;
	};

	/** @returns {{valid:boolean, msg:string}} */
	#closeMenu() {
		/** @type{HUDUnlockNotification} */ // @ts-ignore
		const notifications = this.#root.hud.parts.unlockNotification
		notifications.requestClose();
		return {valid:true, msg: "Upgrade menu closed"};
	}
}