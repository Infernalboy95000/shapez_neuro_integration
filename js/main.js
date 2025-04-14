import { GameSystem	} from "shapez/game/game_system";
import { Mod } from "shapez/mods/mod";

import { NeuroClient } from	'neuro-game-sdk'

const NEURO_SERVER_URL = 'ws://localhost:8000'
const GAME_NAME	= 'Guess the Number'

const neuroClient =	new	NeuroClient(NEURO_SERVER_URL, GAME_NAME, () => {
	neuroClient.registerActions([
		{
		  name:	'guess_number',
		  description: 'Guess the number between 1 and 10.',
		  schema: {
			type: 'object',
			properties:	{
			  number: {	type: 'integer', minimum: 1, maximum: 10 },
			},
			required: ['number'],
		  },
		},
	  ])
	
	  let targetNumber = Math.floor(Math.random() *	10)	+ 1
	
	  neuroClient.onAction(actionData => {
		if (actionData.name	===	'guess_number')	{
		  const	guessedNumber =	actionData.params.number
		  if (
			typeof guessedNumber !== 'number' ||
			guessedNumber <	1 ||
			guessedNumber >	10
		  ) {
			neuroClient.sendActionResult(
			  actionData.id,
			  false,
			  'Invalid number. Please guess	a number between 1 and 10.'
			)
			return
		  }
	
		  if (guessedNumber	===	targetNumber) {
			neuroClient.sendActionResult(
			  actionData.id,
			  true,
			  `Correct!	The	number was ${targetNumber}.	Generating a new number.`
			)
			targetNumber = Math.floor(Math.random()	* 10) +	1
			promptNeuroAction()
		  } else {
			neuroClient.sendActionResult(
			  actionData.id,
			  true,
			  `Incorrect. The number is ${
				guessedNumber <	targetNumber ? 'higher'	: 'lower'
			  }. Try again.`
			)
			promptNeuroAction()
		  }
		} else {
		  neuroClient.sendActionResult(actionData.id, false, 'Unknown action.')
		}
	  })
	
	  neuroClient.sendContext(
		'Game started. I have picked a number between 1	and	10.',
		false
	  )
	
	  function promptNeuroAction() {
		const availableActions = ['guess_number']
		const query	= 'Please guess	a number between 1 and 10.'
		const state	= 'Waiting for your	guess.'
		neuroClient.forceActions(query,	availableActions, state)
	  }
	
	  promptNeuroAction()
})

class TestClass	extends	GameSystem {
	drawChunk(parameters, chunk) {
		const contents = chunk.containedEntitiesByLayer.regular;
		for	(let i = 0; i <	contents.length; ++i) {
			const entity = contents[i];
			const processorComp	= entity.components.ItemProcessor;
			if (!processorComp)	{
				continue;
			}

			const staticComp = entity.components.StaticMapEntity;

			const context =	parameters.context;
			const center = staticComp.getTileSpaceBounds().getCenter().toWorldSpace();

			// Culling for better performance
			if (parameters.visibleRect.containsCircle(center.x,	center.y, 40)) {
				// Circle
				context.fillStyle =	processorComp.ongoingCharges.length	===	0 ?	"#aaa" : "#53cf47";
				context.strokeStyle	= "#000";
				context.lineWidth =	1;

				context.beginCircle(center.x + 5, center.y + 5, 4);
				context.fill();
				context.stroke();
			}
		}
	}
}

class ModImpl extends Mod {
    init() {
		this.modInterface.registerGameSystem({
			id:	"something",
			systemClass: TestClass,
			before:	"belt",
			drawHooks: ["staticAfter"],
		});

		this.settings.timesLaunched++;
		this.saveSettings();

		// Show	a dialog in the	main menu with the settings
		/*
		this.signals.stateEntered.add(state	=> {
			if (state instanceof shapez.MainMenuState) {
				this.dialogs.showInfo(
					"Welcome back",
					`You have launched this	mod	${this.settings.timesLaunched} times`
				);
			}
		});
		*/

		this.signals.stateEntered.add(state => {
            if (state.key === "SettingsState") {
				const parent = document.getElementsByClassName("sidebar");
				const otherBlock = document.getElementsByClassName("other ");
                const button = document.createElement("button");
                button.classList.add("styledButton");
                button.innerText = "Hello world Hope git doesn't break this, please!";
                button.addEventListener("click", () => {
                    this.dialogs.showInfo("Mod Message", "Button clicked!");
                });
                parent[0].insertBefore(button, otherBlock[0]);
            }
        });

        this.modInterface.registerCss(`
                #demo_mod_hello_world_element {
                    position: absolute;
                    top: calc(10px * var(--ui-scale));
                    left: calc(10px * var(--ui-scale));
                    color: red;
                    z-index: 0;
                }

            `);
	}
}
