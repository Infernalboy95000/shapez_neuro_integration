import { SdkAction } from "../definitions/sdkAction";

export class InGameActionList {
	static PLACE_BUILDING = new SdkAction(
		"place_building", "Select and place a building from your toolbelt."
	)

	static PLACE_BUILDINGS_LINE = new SdkAction(
		"place_buildings_line", "Place an entire line of buildings at once. Just tell where to start, a direction and the length of that line."
	)

	static BELT_PLANNER = new SdkAction(
		"use_belt_planner", "Place several belts in one go. Allows to rotate mid placement, drawing an L shape."
	)

	static DELETE_BUILDING = new SdkAction(
		"delete_building", "Delete an already placed building in the map."
	)

	static DELETE_IN_AREA = new SdkAction(
		"delete_in_area", "Delete all buildings in an square area you choose. Please, define the area from the bottom corner to the top corner."
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
		"patches_nearby", "See if there's patches currently in view."
	)

	static DESCRIBE_PATCH = new SdkAction(
		"describe_patch", "Fully describe all positions that compose a patch. Scanning for patches nearby first might help you find them."
	)

	static MOVE_CAMERA = new SdkAction(
		"move_camera", "Move the camera at a nearby position."
	)

	static CHANGE_ZOOM = new SdkAction(
		"change_zoom", "Adjust your current camera zoom. If you zoom far enough, you will enter map overwiew mode."
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