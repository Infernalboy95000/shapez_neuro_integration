import { SdkAction } from "./sdkAction";

export class SimpleSdkAction extends SdkAction {
	constructor(actionName, actionDescription) {
		super(actionName, actionDescription);
	}

	/** @returns{Object} */
	build() {
		return super.build();
	}
}