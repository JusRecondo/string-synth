import { brownNoise, createBrownNoise, noiseGainNode } from './noise.js';
import {
	on,
	off,
	startPlay
} from './audio.js';
import { 
	textToSpeech, 
	stopSpeech } 
from './voice.js';

export const playBtn = document.querySelector('#play');
const stopBtn = document.querySelector('#stop');
const controls = document.querySelector('#controls');
const controlsBtn = document.querySelector('#controls-btn');
export const textInput = document.querySelector('#textInput');

//Show/hide controls
controlsBtn.addEventListener('click', () => {
	controls.classList.toggle('hide');
	textInput.classList.toggle('transparent');
});

//Test input
let strings = null;

textInput.addEventListener('input', function() {
	strings = this.value.toLowerCase();
	this.classList.remove('transparent');
	
	controls.classList.remove('hide');
	controlsBtn.classList.remove('hide');

	if(this.value === '') {
		controls.classList.add('hide');
		controlsBtn.classList.add('hide');
	}
});

//Interactions
//Start playing
playBtn.addEventListener('click', () => {
	on();
	//console.log(strings);
	startPlay(strings);

	textInput.classList.add('play');
	setTimeout(() => {
		textInput.classList.remove('play');
	}, 200);

});

stopBtn.addEventListener('click', () => {
	off();
});

//Text to speech: "read" the strings with SpeechSynthesis API
const speakBtn = document.querySelector('#speak');
const stopSpeakBtn = document.querySelector('#stopSpeak');

speakBtn.addEventListener('click', () => {
	textToSpeech(strings);
	speakBtn.classList.add('play');
});

stopSpeakBtn.addEventListener('click', () => {
	stopSpeech();
	speakBtn.classList.remove('play');
});
