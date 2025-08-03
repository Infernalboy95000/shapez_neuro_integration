import { enumItemProcessorTypes, ItemProcessorComponent } from "shapez/game/components/item_processor";
import { LeverComponent } from "shapez/game/components/lever";
import { MinerComponent } from "shapez/game/components/miner";
import { WireComponent } from "shapez/game/components/wire";
import { ShapeItem } from "shapez/game/items/shape_item";
import { GameRoot } from "shapez/game/root";
import { TutorialChecks } from "./tutorialChecks";

export class TutorialList {
	static tutorialsByLevel = [
		// Level 1
		[
			// 1.0. scan the terrain
			{
				id: "1_0_scan",
				condition: /** @param {GameRoot} root */ root => {
					const miners = root.entityMgr.getAllWithComponent(MinerComponent);

					if (miners.length === 0 && TutorialChecks.scanned == false) {
						return true;
					}
					else {
						return false;
					}
				},
			},
			// 1.0. scan our patch
			{
				id: "1_0_deep_scan",
				condition: /** @param {GameRoot} root */ root => {
					const miners = root.entityMgr.getAllWithComponent(MinerComponent);

					if (miners.length === 0 && TutorialChecks.deepScanned == false) {
						return true;
					}
					else {
						return false;
					}
				},
			},
			// 1.1. place an extractor
			{
				id: "1_1_extractor",
				condition: /** @param {GameRoot} root */ root =>
					root.entityMgr.getAllWithComponent(MinerComponent).length === 0,
			},
			// 1.1. scan the buildings
			{
				id: "1_1_buildings_scan",
				condition: /** @param {GameRoot} root */ root => {
					const miners = root.entityMgr.getAllWithComponent(MinerComponent);

					if (miners.length > 0 && TutorialChecks.buildingScanned == false) {
						return true;
					}
					else {
						return false;
					}
				}
			},
			// 1.2. connect to hub
			{
				id: "1_2_conveyor",
				condition: /** @param {GameRoot} root */ root => {
					const paths = root.systemMgr.systems.belt.beltPaths;
					const miners = root.entityMgr.getAllWithComponent(MinerComponent);
					for (let i = 0; i < paths.length; i++) {
						const path = paths[i];
						const acceptingEntity = path.computeAcceptingEntityAndSlot().entity;
						if (!acceptingEntity || !acceptingEntity.components.Hub) {
							continue;
						}
						// Find a miner which delivers to this belt path
						for (let k = 0; k < miners.length; ++k) {
							const miner = miners[k];
							if (miner.components.ItemEjector.slots[0].cachedBeltPath === path) {
								return false;
							}
						}
					}
					return true;
				},
			},
			// 1.3 wait for completion
			{
				id: "1_3_expand",
				condition: /** @param {GameRoot} root */ root => true,
			},
		],
		// Level 2
		[
			// 2.1 place a cutter
			{
				id: "2_1_place_cutter",
				condition: /** @param {GameRoot} root */ root =>
					root.entityMgr
						.getAllWithComponent(ItemProcessorComponent)
						.filter(e => e.components.ItemProcessor.type === enumItemProcessorTypes.cutter).length ===
					0,
			},
			// 2.2 place trash
			{
				id: "2_2_place_trash",
				condition: /** @param {GameRoot} root */ root =>
					root.entityMgr
						.getAllWithComponent(ItemProcessorComponent)
						.filter(e => e.components.ItemProcessor.type === enumItemProcessorTypes.trash).length ===
					0,
			},
			// 2.3 place more cutters
			{
				id: "2_3_more_cutters",
				condition: /** @param {GameRoot} root */ root => true,
			},
		],

		// Level 3
		[
			// 3.1. rectangles
			{
				id: "3_1_rectangles",
				condition: /** @param {GameRoot} root */ root =>
					// 4 miners placed above rectangles and 10 delivered
					root.hubGoals.getCurrentGoalDelivered() < 10 ||
					root.entityMgr.getAllWithComponent(MinerComponent).filter(entity => {
						const tile = entity.components.StaticMapEntity.origin;
						const below = root.map.getLowerLayerContentXY(tile.x, tile.y);
						if (below && below.getItemType() === "shape") {
							const shape = /** @type {ShapeItem} */ (below).definition.getHash();
							return shape === "RuRuRuRu";
						}
						return false;
					}).length < 4,
			},
		],

		[], // Level 4
		[], // Level 5
		[], // Level 6
		[], // Level 7
		[], // Level 8
		[], // Level 9
		[], // Level 10
		[], // Level 11
		[], // Level 12
		[], // Level 13
		[], // Level 14
		[], // Level 15
		[], // Level 16
		[], // Level 17
		[], // Level 18
		[], // Level 19
		[], // Level 20

		// Level 21
		[
			// 21.1 place quad painter
			{
				id: "21_1_place_quad_painter",
				condition: /** @param {GameRoot} root */ root =>
					root.entityMgr
						.getAllWithComponent(ItemProcessorComponent)
						.filter(e => e.components.ItemProcessor.type === enumItemProcessorTypes.painterQuad)
						.length === 0,
			},

			// 21.2 switch to wires layer
			{
				id: "21_2_switch_to_wires",
				condition: /** @param {GameRoot} root */ root =>
					root.entityMgr.getAllWithComponent(WireComponent).length < 5,
			},

			// 21.3 place button
			{
				id: "21_3_place_button",
				condition: /** @param {GameRoot} root */ root =>
					root.entityMgr.getAllWithComponent(LeverComponent).length === 0,
			},

			// 21.4 activate button
			{
				id: "21_4_press_button",
				condition: /** @param {GameRoot} root */ root =>
					root.entityMgr.getAllWithComponent(LeverComponent).some(e => !e.components.Lever.toggled),
			},
		],
	];
}