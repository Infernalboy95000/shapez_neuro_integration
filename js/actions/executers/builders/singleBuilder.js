import { Vector } from "shapez/core/vector";
import { ToolbeltSelector } from "./toolbeltSelector";

/** Allows building or deleting on a single position. */
export class SingleBuilder {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ToolbeltSelector} */ #toolbelt;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		this.#toolbelt = new ToolbeltSelector(root);
	}

	/**
	 * @param {string} buildName
	 * @param {string} rotName
	 * @param {number} posX
	 * @param {number} posY
	 * @returns {{valid:boolean, msg:string}} */
	tryPlaceBuilding(buildName, rotName, posX, posY) {
		const result = this.trySelectAndRotate(buildName, rotName);
		if (!result.valid) {
			return result;
		}

		const pos = new Vector(posX, posY);
		if (!this.tryPlaceCurrentAt(posX, posY)) {
			result.valid = false;
			result.msg = `Cannot place ${buildName} at x: ${posX}, y: ${posY}.`

			const overlap = this.#checkOverlap(buildName, pos);
			if (overlap != null) {
				result.msg += ` It's overlapping a ${overlap.buildName} ` +
				`at x: ${overlap.position.x}, y: ${overlap.position.y}.`

				if (!overlap.removable) {
					result.msg += ` The ${overlap.buildName} is not removable!`
				}
			}
		}

		if (result.valid) {
			this.playPlacementSound(buildName);
			result.msg = `Placed ${buildName} at x: ${posX}, y: ${posY}.`;
		}

		return result;
	}

	/**
	 * @param {string} buildName
	 * @param {string} rotName
	 * @returns {{valid:boolean, msg:string}} */
	trySelectAndRotate(buildName, rotName) {
		return this.#toolbelt.trySelectAndRotate(buildName, rotName);
	}

	/**
	 * @param {number} posX
	 * @param {number} posY
	 * @returns {boolean} */
	tryPlaceCurrentAt(posX, posY) {
		const pos = new Vector(posX, posY)
		return this.#root.hud.parts.buildingPlacer.tryPlaceCurrentBuildingAt(pos);
	}

	/** @param {string} buildName */
	playPlacementSound(buildName) {
		const building = this.#toolbelt.getBuildingByName(buildName);
		this.#root.soundProxy.playUi(building.getPlacementSound());
	}

	/**
	 * @param {string} buildName
	 * @param {Vector} tile
	 * @return {{buildName:string,position:Vector,removable:boolean}}
	 */
	#checkOverlap(buildName, tile) {
		// I feel that this is too complex for what is doing.
		const building = this.#toolbelt.getBuildingByName(buildName);
		
		const { rotation, rotationVariant } = building.computeOptimalDirectionAndRotationVariantAtTile({
			root: this.#root,
			tile,
			rotation: this.#root.hud.parts.buildingPlacer.currentBaseRotation,
			variant: this.#root.hud.parts.buildingPlacer.currentVariant.lastSeenValue,
			layer: building.getLayer(),
		});

		const entity = building.createEntity ({
			origin: tile,
			rotation,
			rotationVariant,
			originalRotation: this.#root.hud.parts.buildingPlacer.currentBaseRotation,
			// @ts-ignore
			building: building,
			variant: this.#root.hud.parts.buildingPlacer.currentVariant.lastSeenValue,
		});

		const rect = entity.components.StaticMapEntity.getTileSpaceBounds();

		// Check the whole area of the building
		for (let x = rect.x; x < rect.x + rect.w; ++x) {
			for (let y = rect.y; y < rect.y + rect.h; ++y) {
				const otherEntity = this.#root.map.getLayerContentXY(x, y, entity.layer);
				if (otherEntity) {
					const staticComp = otherEntity.components.StaticMapEntity;
					const meta = staticComp.getMetaBuilding();
					return {
						buildName: meta.getId(),
						position: new Vector(x, y),
						removable: meta.getIsRemovable(this.#root)
					}
				}
			}
		}
		return null;
	}
}