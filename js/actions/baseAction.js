export class BaseAction {
	/**
	 * @param {{id:string,name:string,params:{}}} data
	 * @returns {boolean}
	 */
	tryAction(data) {
		return false;
	}
}