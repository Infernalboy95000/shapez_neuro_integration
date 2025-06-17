export class InGameActionList {
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