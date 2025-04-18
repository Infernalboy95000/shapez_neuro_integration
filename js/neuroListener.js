// @ts-ignore
import { NeuroClient } from 'neuro-game-sdk';
const GAME_NAME = 'Shapez';

let neuroClient;

export class NeuroListener {
	constructor(URL) {
		neuroClient = new NeuroClient(URL, GAME_NAME, () => {
		  neuroClient.registerActions([
			{
			  name: 'guess_number',
			  description: 'Guess the number between 1 and 10.',
			  schema: {
				type: 'object',
				properties: {
				  number: { type: 'integer', minimum: 1, maximum: 10 },
				},
				required: ['number'],
			  },
			},
		  ])
		
		  let targetNumber = Math.floor(Math.random() * 10) + 1
		
		  neuroClient.onAction(actionData => {
			if (actionData.name === 'guess_number') {
			  const guessedNumber = actionData.params.number
			  if (
				typeof guessedNumber !== 'number' ||
				guessedNumber < 1 ||
				guessedNumber > 10
			  ) {
				neuroClient.sendActionResult(
				  actionData.id,
				  false,
				  'Invalid number. Please guess a number between 1 and 10.'
				)
				return
			  }
		
			  if (guessedNumber === targetNumber) {
				neuroClient.sendActionResult(
				  actionData.id,
				  true,
				  `Correct! The number was ${targetNumber}. Generating a new number.`
				)
				targetNumber = Math.floor(Math.random() * 10) + 1
				promptNeuroAction()
			  } else {
				neuroClient.sendActionResult(
				  actionData.id,
				  true,
				  `Incorrect. The number is ${
					guessedNumber < targetNumber ? 'higher' : 'lower'
				  }. Try again.`
				)
				promptNeuroAction()
			  }
			} else {
			  neuroClient.sendActionResult(actionData.id, false, 'Unknown action.')
			}
		  })
		
		  neuroClient.sendContext(
			'Game started. I have picked a number between 1 and 10.',
			false
		  )
		
		  function promptNeuroAction() {
			const availableActions = ['guess_number']
			const query = 'Please guess a number between 1 and 10.'
			const state = 'Waiting for your guess.'
			neuroClient.forceActions(query, availableActions, state)
		  }
		
		  promptNeuroAction()
		})
	}

	disconnect() {
		neuroClient.disconnect();
	}
}