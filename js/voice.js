import { getRandomValue } from './utilities.js';

/* UI */
const voiceVolumeInput = document.querySelector('#voice-volume');
const voiceRateInput = document.querySelector('#voice-rate');

let voiceVolume = 0.05;

voiceVolumeInput.addEventListener('input', e => {
	let value = parseFloat(e.target.value);
	value = value.toFixed(2);
    voiceVolume = value;
});

let voiceRate = 0.05;

voiceRateInput.addEventListener('input', e => {
	let value = parseFloat(e.target.value);
	value = value.toFixed(2);
    voiceRate = value;
});

const voiceSynth = window.speechSynthesis;

const fetchAllVoices = new Promise(function (resolve, reject) {
	let voices = window.speechSynthesis.getVoices();
	if (voices.length !== 0) {
		resolve(voices);
	} else {
		window.speechSynthesis.addEventListener('voiceschanged', function () {
			voices = window.speechSynthesis.getVoices();
			resolve(voices);
		});
	}
});

export const textToSpeech = strings => {
	const toSpeak = new SpeechSynthesisUtterance(strings);

	fetchAllVoices.then(voices => {
		const randomValForVoice = getRandomValue(0, 99);
		toSpeak.voice = voices[randomValForVoice];
		toSpeak.pitch = 0.1;
		toSpeak.rate = voiceRate;
		toSpeak.volume = voiceVolume;
		console.log(toSpeak.volume)

		voiceSynth.speak(toSpeak);
	});
};

export const stopSpeech = () => {
	voiceSynth.cancel();
};
