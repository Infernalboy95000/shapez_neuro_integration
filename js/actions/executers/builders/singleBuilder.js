import { Vector } from "shapez/core/vector";
import { ToolbeltSelector } from "../selectors/toolbeltSelector";
import { T } from "shapez/translations";

/** Allows building at a single position. */
export class SingleBuilder {
	/** @type {import("shapez/game/root").GameRoot} */ #root;
	/** @type {ToolbeltSelector} */ #toolbelt;

	/** @param {import("shapez/game/root").GameRoot} root */
	constructor(root) {
		this.#root = root;
		this.#toolbelt = new ToolbeltSelector(root);
	}

	/**
	 * @param {string} buildID
	 * @param {string} variant
	 * @param {string} rotName
	 * @param {number} posX
	 * @param {number} posY
	 * @returns {{valid:boolean, msg:string}} */
	tryPlaceBuilding(buildID, variant, rotName, posX, posY) {
		const result = this.trySelectAndRotate(buildID, variant, rotName);
		if (!result.valid) {
			return result;
		}

		const pos = new Vector(posX, posY);
		if (!this.tryPlaceCurrentAt(posX, posY)) {
			result.valid = false;
			result.msg = `Cannot place ${buildID} at x: ${posX}, y: ${posY}.`

			const overlap = this.#checkOverlap(buildID, variant, pos);
			if (overlap != null) {
				result.msg += ` It's overlapping a ${overlap.buildName} ` +
				`at x: ${overlap.position.x}, y: ${overlap.position.y}.`

				if (!overlap.removable) {
					result.msg += ` The ${overlap.buildName} is not removable!`
				}
			}
		}

		if (result.valid) {
			this.playPlacementSound(buildID);
			result.msg = `Placed ${buildID} at x: ${posX}, y: ${posY}.`;
		}

		return result;
	}

	/**
	 * @param {string} buildID
	 * @param {string} variant
	 * @param {string} rotName
	 * @returns {{valid:boolean, msg:string}} */
	trySelectAndRotate(buildID, variant, rotName) {
		return this.#toolbelt.trySelectAndRotate(buildID, variant, rotName);
	}

	/**
	 * @param {number} posX
	 * @param {number} posY
	 * @returns {boolean} */
	tryPlaceCurrentAt(posX, posY) {
		const pos = new Vector(posX, posY)
		return this.#root.hud.parts.buildingPlacer.tryPlaceCurrentBuildingAt(pos);
	}

	/** @param {string} buildID */
	playPlacementSound(buildID) {
		const building = this.#toolbelt.getBuildingByID(buildID);
		this.#root.soundProxy.playUi(building.getPlacementSound());
	}

	/**
	 * @param {string} buildID
	 * @param {string} variant
	 * @param {Vector} tile
	 * @return {{buildName:string,position:Vector,removable:boolean}}
	 */
	#checkOverlap(buildID, variant, tile) {
		// I feel that this is too complex for what is doing.
		const building = this.#toolbelt.getBuildingByID(buildID);
		
		const { rotation, rotationVariant } = building.computeOptimalDirectionAndRotationVariantAtTile({
			root: this.#root,
			tile,
			rotation: this.#root.hud.parts.buildingPlacer.currentBaseRotation,
			variant: variant,
			layer: building.getLayer(),
		});

		const entity = building.createEntity ({
			origin: tile,
			rotation,
			rotationVariant,
			originalRotation: this.#root.hud.parts.buildingPlacer.currentBaseRotation,
			// @ts-ignore
			building: building,
			variant: variant,
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
						buildName: T.buildings[meta.getId()].default.name,
						position: new Vector(x, y),
						removable: meta.getIsRemovable(this.#root)
					}
				}
			}
		}
		return null;
	}
}