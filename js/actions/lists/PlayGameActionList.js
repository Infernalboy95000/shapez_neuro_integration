import { EnumSchema } from "../../sdkActions/schema/enumSchema";
import { SchemaBase } from "../../sdkActions/schema/schemaBase";
import { SdkAction } from "../../sdkActions/sdkAction";

export class PlayGameActionList {
	static playGame = "play_game";
	static newGame = "new_game";
	static continueGame = "continue_game";
	static loadGame = "load_game";
	static actions = [
		// This action is used when only one map is allowed, to simplify
		new SdkAction(this.playGame,
			"Play the game"
		),
		new SdkAction(this.newGame,
			"Play in a new map"
		),
		new SdkAction(this.continueGame,
			"Continue last played map"
		),
		new SdkAction(this.loadGame,
			"Select the map you want to load"
		)
	];

	static map = "map";

	/**
	 * @param {Array<string>} maps
	 * @returns {Map<string, Array<SchemaBase>>}
	 * */
	static getOptions(maps) {
		const options = {
			[this.map]: new EnumSchema(this.map, maps),
		};
		return this.#mapOptions(options);
	}

	/**
	 * @param {Object} options
	 * @returns {Map<string, Array<SchemaBase>>}
	 */
	static #mapOptions(options) {
		return new Map([
			[
				this.loadGame, [
					options[this.map]
				]
			]
		]);
	}
}