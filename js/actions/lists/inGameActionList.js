import { SdkAction } from "../definitions/sdkAction";

export class InGameActionList {
	static PLACE_BUILDING = new SdkAction(
		"place_building", "Select and place a building from your toolbelt."
	)

	static DESCRIBE_TOOLBELT_BUILDING = new SdkAction(
		"describe_toolbelt_building", "Get all the stats of one of your available builds, like work speed."
	);

	static PLACE_BUILDINGS_LINE = new SdkAction(
		"place_buildings_line", "Place an entire line of buildings at once. Just tell where to start, a direction and the length of that line."
	)

	static BELT_PLANNER = new SdkAction(
		"use_belt_planner", "Place belts in a path from one point to the other."
	)

	static DELETE_BUILDING = new SdkAction(
		"delete_building", "Delete an already placed building in the map."
	)

	static DELETE_IN_AREA = new SdkAction(
		"delete_in_area", "Delete all buildings in an square area you choose. Please, define the area from the bottom left corner to the top right corner."
	)

	static CLEAR_BELTS = new SdkAction(
		"clear_belts", "Clear all belts in an square area you choose."
	)

	static CUT_SELECTION = new SdkAction(
		"cut_selection", "Cut the buildings in an square area you choose."
	)

	static COPY_SELECTION = new SdkAction(
		"cut_selection", "Copy the buildings in an square area you choose."
	)

	static PATCHES_NEARBY = new SdkAction(
		"scan_terrain", "See if there's patches currently in view."
	)

	static DESCRIBE_PATCH = new SdkAction(
		"describe_patch", "Fully describe all positions that compose a patch. Scanning terrain first might help you find them."
	)

	static DESCRIBE_BUILDINGS = new SdkAction(
		"scan_buildings", "Fully describe all buildings in view."
	)

	// Only show if hub is visible?
	static DESCRIBE_HUB = new SdkAction(
		"describe_hub", "Describe all HUB's inputs positions and directions."
	)

	static MOVE_CAMERA = new SdkAction(
		"move_camera", "Move the camera at a nearby position."
	)

	static CHANGE_ZOOM = new SdkAction(
		"change_zoom", "Adjust your current camera zoom. If you zoom far enough, you will enter map overwiew mode."
	)

	static DESCRIBE_CURRENT_GOAL = new SdkAction(
		"describe_current_goal", "Describe what's the current shape you have to deliver to the HUB in order to get to the next level."
	)

	static GET_PINNED_SHAPES = new SdkAction(
		"get_pinned_shapes", "Get the list of shapes you have pinned. Those are probably related to upgrade goals."
	)

	/*
	- Select building [Buiilding name]
	<- Tell building name, variant, speed, current rotation, etc...

	- Stop placement
	<- Confirm that the cursor is clear

	- Rotate building
	<- Confirm and tell where the building will point at

	- Change variant
	<- Confirm and tell all stats of the new variant selected

	- Place building [x, y coordinates]

	- (Only if belts are selected) Place belts [x, y origin, x, y destination]

	- (If tutorial is enabled)
	<- Context: Tell what the tutorial is saying
	? Problematic if it's telling to use mouse movements

	- Move [direction, steps]
	- Move to position [x, y coordinates]
	<- Confirm movement

	- Zoom in [steps]
	<- Confirm zoom in or tell if we're already in max zoom
	<- Tell when we're exiting map overview mode

	- Zoom out [steps]
	<- Confirm zoom out or tell if we're already in min zoom
	<- Tell when we're entering map overview mode

	- Target piece progress
	<- Tell a simple piece description? and current pieces delivered

	- Target piece detailed info
	<- Tell every layer piece info in a detailed way

	- Save game
	- Pause game (If permission given)
	<- Tell the info in pause screen (Belts, buildings and playtime)
	*/
}