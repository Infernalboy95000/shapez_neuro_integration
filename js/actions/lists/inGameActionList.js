import { SdkAction } from "../definitions/sdkAction";

export class InGameActionList {
	static SELECT_BUILDING = new SdkAction(
		"select_building", "Select a building from your toolbelt"
	)

	static STOP_PLACEMENT = new SdkAction(
		"stop_placement", "Deselects your currently selected building"
	)

	static ROTATE_BUILDING = new SdkAction(
		"rotate_building", "Choose in which direction should face your selected building"
	)

	static PLACE_BUILDING = new SdkAction(
		"place_building", "Place your building at any position, if there's no other building there"
	)

	static BELT_PLANNER = new SdkAction(
		"use_belt_planner", "Place several belts in one go. Allows to rotate mid placement, drawing an L shape"
	)

	static PLACE_MULTIPLE = new SdkAction(
		"place_multiple", "Place an entire line of buildings at once, just tell where to start, a direction and length"
	)

	static DELETE_BUILDING = new SdkAction(
		"delete_building", "Delete an already placed building"
	)

	static SELECT_AREA = new SdkAction(
		"select_area", "Select an area with buildings to perform actions on those"
	)

	static DELETE_IN_AREA = new SdkAction(
		"delete_in_area", "Delete all buildings in the selected area"
	)

	static CLEAR_BELTS = new SdkAction(
		"clear_belts", "Clear all belts in the selected area"
	)

	static CUT_SELECTION = new SdkAction(
		"cut_selection", "Cut the buildings in the selected area"
	)

	static COPY_SELECTION = new SdkAction(
		"cut_selection", "Copy the buildings in the selected area"
	)

	static CLEAR_SELECTION = new SdkAction(
		"clear_selection", "Deselect a selected area"
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