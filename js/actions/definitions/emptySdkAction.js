import { SdkAction } from "./sdkAction";

export class EmptySdkAction extends SdkAction {
	/**
	 * @param {string} actionName
	 * @param {string} actionDescription
	 */
	constructor(actionName, actionDescription) {
		super(actionName, actionDescription);
	}

	/** @returns{Object} */
	build() {
		return super.build();
	}
}