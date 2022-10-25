import { getRandomValue } from './utilities.js';

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
		toSpeak.rate = 0.1;
		toSpeak.volume = 0.05;

		voiceSynth.speak(toSpeak);
	});
};

export const stopSpeech = () => {
	voiceSynth.cancel();
};
