# Shapez Neuro SDK

This tool allows any client (player) that supports the [neuro SDK](https://github.com/VedalAI/neuro-sdk) to interact and play the [shapez game](https://store.steampowered.com/app/1318690/shapez/)!<br/>

> [!WARNING]
> This mod is in beta. Meaning it's incomplete and misses features.

## What it can do?

This mod gives to the player:
- The option to play a map chosen by you in settings (even a new one), or any of the available.
	- There's also a way to force open a map, if you don't trust your player.
- The ability to respond to all dialogs that can happen.
	- *rename map, delete map and language menu are excluded.*
- Every action a human player can do inside a map (Includes end game)
	- An extra action to build an entire line of buildings in one go.
	- Access to the "belt planner" for easier belt building
	- Optional access to pause, exit a map and close the game.
- Crude text descriptors of the world
	- "Scan terrain" describes where shape patches are.
	- "Deep scan" describes all positions of a selected patch (or a close one).
	- "Scan buildings" tries to describe every building in view and their state.
- A visual grid that shows every coordinate of the grid.
	- *Only usefull for debug or with visual data as input.*

> [!NOTE]
> The player has no access to the settings menu. This is your safe menu for when you want to be sure the player does nothing.

## What's missing?

- The text descriptior of the signal layer
- Some way to cancel the "force play map"
- Context upgrades. Maybe even an option to automatically refresh the buildings context every few seconds.
- Lots of testing

## How to install?

> [!WARNING]
> Mods in shapez can only be installed in the full version of steam.

1. Download the latest file in the releases menu
2. Move the .js file to your shapez mod folder
	- It's easier to locate if you open the shapez game.
	- Click "mods". Then, click "Open mods folder".
	- Otherwise, you can find the folder in:
		- Windows: %AppData%/Roaming/shapez.io/mods
		- Linux: ˜/.local/share/shapez.io/mods
3. Restart the game. There should be a new window indicating the SDK status.

## How to use?

There should be a new window bellow MODS.<br>Insert your player's URL in the text field bellow and press **CONNECT**. It should connect after a while.<br><br>
If you need a player, follow this [link](shapezio-mods\src\neuro_integration) to get one and try to play the game.<br>

> [!NOTE]
> You can always adjust the mod behaviour by going into the settings and pressing the **NEURO SDK** button.

> [!WARNING]
> Your AI player might get easily stucked. I'm deeply sorry. My text description is incomplete and not good at all.

## How to contribute?

Simply testing the mod by yourself is way more than I could ask for.<br>
But if you want to adventure yourself into my messy code, here are the instructions to make it work:

1. Install the [mod builder](https://github.com/DJ1TJOO/create-shapez.io-mod?tab=readme-ov-file#usage) and follow it's instructions.
2. Navigate to the shapezio-mods\src\ folder and pull there this github repository.
3. Open a terminal and navigate to shapezio-mods\src\neuro_integration
4. Type ```yarn dev``` in the terminal to test the mod.<br>
If that doesn't work, you need to type ```yarn build``` instead and go to the shapezio-mods\build folder.
5. If you had to build the mod, you need to move the generated .js file to your shapez mod folder.<br>
You can open the console in shapez, in steam, by introducing --dev into the game's launching parameters.

> [!WARNING]
> If there's no .js file after the build command is done, that means the builder found something wrong. It always replies with "Build OK" regardless so, good luck.<br>
> In my case, the builder stopped working after a computer restart. I suspect that's because the builder doesn't like the git files and bugs out.<br>
> If that happens to you, you need to redo the entire installation process. But this time, the repository should be on a different folder and each time you want to test the mod, you need to copy all the files and folders onto the real shapezio-mods\src\neuro_integration folder.<br>
> *I wish this was a joke...*
