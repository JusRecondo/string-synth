import { on, off, startPlay } from './audio.js';
import { initHydraVisuals } from './hydra.js';
import { initMIDI } from './midi.js';
import { textToSpeech, stopSpeech } from './voice.js';

/* UI */
export const playBtn = document.querySelector('#play');
export const textInput = document.querySelector('#textInput');
const stopBtn = document.querySelector('#stop');
const controls = document.querySelector('#controls');
const controlsBtn = document.querySelector('#controls-btn');

//Show/hide controls
controlsBtn.addEventListener('click', () => {
    controls.classList.toggle('hide');
    textInput.classList.toggle('transparent');
});


let strings = null;

textInput.addEventListener('input', function () {
    strings = this.value.toLowerCase();
    this.classList.remove('transparent');

    controls.classList.remove('hide');
    controlsBtn.classList.remove('hide');

    if (this.value === '') {
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

//MIDI
initMIDI();


//Hydra visuals
initHydraVisuals();
