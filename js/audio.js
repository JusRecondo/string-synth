/*
*   Module for Audio configuration and sound making.
*/

import {
    getRandomValue,
    mapping,
    performanceFinished,
    characters,
    getRandomValueWithDecimals,
    createCounter,
} from './utilities.js';

/* UI */
export const volumeInput = document.querySelector('#volume');
export const densityInput = document.querySelector('#density');
export const filterCutInput = document.querySelector('#filter-cut');
export const filterResInput = document.querySelector('#filter-res');

//Audio config
export const audioCtx = new (window.AudioContext ||
    window.webkitAudioContext)();
const output = audioCtx.destination;

//On audio
export const on = () => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

//Off audio
export const off = () => {
    if (audioCtx.state === 'running') {
        audioCtx.suspend();
    }
};

//Reverb
const makeReverb = async (audioCtx, impulseUrl) => {
    const convolver = audioCtx.createConvolver();
    let response = await fetch(impulseUrl);
    let arraybuffer = await response.arrayBuffer();
    convolver.buffer = await audioCtx.decodeAudioData(arraybuffer);

    return convolver;
};

const reverb = await makeReverb(audioCtx, 'assets/impulse.wav');
reverb.connect(output);

//Compressor
const compressor = audioCtx.createDynamicsCompressor();
compressor.ratio.value = 12;
compressor.release.value = 0.5;
compressor.threshold.value = -26;
compressor.connect(reverb);

//Master volume
export const gainNode = audioCtx.createGain();
gainNode.gain.setTargetAtTime(0.2, audioCtx.currentTime, 0);
gainNode.connect(compressor);

//Volume control
export const setMasterVolume = value => {
    if (audioCtx && gainNode) {
        gainNode.gain.linearRampToValueAtTime(
            value,
            audioCtx.currentTime + 0.1
        );
    }
};

volumeInput.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    setMasterVolume(value);
});

//Filter
export const filter = audioCtx.createBiquadFilter();
filter.frequency.setTargetAtTime(5000, audioCtx.currentTime, 0.1);
filter.Q.setTargetAtTime(1, audioCtx.currentTime, 0.1);
filter.connect(gainNode);

//Filter controls
export const setFilterCut = value => {
    if (audioCtx && filter) {
        filter.frequency.exponentialRampToValueAtTime(
            value,
            audioCtx.currentTime + 0.2
        );
    }
};

filterCutInput.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    setFilterCut(value);
});

export const setFilterRes = value => {
    if (audioCtx && filter) {
        filter.Q.value = value;
    }
};

filterResInput.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    setFilterRes(value);
});

// Create oscillator
const createOsc = oscParams => {
    const {
        frequency,
        detune,
        pitchDirection,
        waveType,
        duration,
        connection,
        pan,
        movement,
    } = oscParams;

    const osc = audioCtx.createOscillator();

    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    if (pitchDirection === 'desc') {
        osc.detune.setValueAtTime(detune, audioCtx.currentTime);
        osc.detune.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
    } else if (pitchDirection === 'asc') {
        osc.detune.setValueAtTime(0, audioCtx.currentTime);
        osc.detune.linearRampToValueAtTime(
            detune,
            audioCtx.currentTime + duration / 2
        );
    }

    osc.type = waveType;

    //Stereo panning
    const panNode = audioCtx.createStereoPanner();
    panNode.connect(connection);

    panNode.pan.setValueAtTime(pan, audioCtx.currentTime);
    if (movement) {
        panNode.pan.linearRampToValueAtTime(
            -pan,
            audioCtx.currentTime + duration / 2
        );
    }

    const oscGain = audioCtx.createGain();
    oscGain.gain.setTargetAtTime(0.06, audioCtx.currentTime, 0);
    oscGain.connect(panNode);

    osc.connect(oscGain);
    osc.start();

    //Oscilator release
    oscGain.gain.linearRampToValueAtTime(
        0,
        audioCtx.currentTime + (duration - 0.1)
    );

    //Oscillator off
    osc.stop(audioCtx.currentTime + duration);
    osc.onended = () => {
        oscGain.disconnect();
        panNode.disconnect();
    };

    return osc;
};

//Variation in time interval between sounds
let density = 2700;
densityInput.addEventListener('input', e => {
    density = e.target.value;
});

//Translates each character to sound at random time intervals
const interpreter = (strings, interval, index, visualCounter) => {
    setTimeout(() => {
        const character = strings.charAt(index);
        const totalCharacters = Object.keys(characters).length;
        const characterCode = characters[character];

        visualCounter.innerText = strings.length - 1 - index;

        //random params for oscillators
        let waves = ['triangle', 'square', 'sawtooth'];
        let randomWave = waves[getRandomValue(0, 3)];
        let randomPan = getRandomValueWithDecimals(-1, 1);
        let randomMov = getRandomValue(0, 2);

        //Default osc params
        let oscParams = {
            frequency: 100,
            detune: audioCtx.currentTime,
            pitchDirection: 'desc',
            waveType: randomWave,
            duration: 1,
            connection: filter,
            pan: randomPan,
            movement: randomMov === 1 ? true : false,
        };

        if (characterCode !== undefined) {
            oscParams.frequency = mapping(
                totalCharacters,
                characterCode,
                900,
                40
            );
            oscParams.duration = characterCode / 2;

            //If character is '.', pitch direction changes
            if (characterCode === 42) {
                oscParams.pitchDirection = 'asc';
            }
        }

        createOsc(oscParams);

        //Show info in console
        console.table({[character]: oscParams});

        let maxValueForTimeInterval = density;
        let randomTimeInterval;

        if (index < strings.length - 1) {
            randomTimeInterval = getRandomValue(27, maxValueForTimeInterval);
            index++;
            interpreter(strings, randomTimeInterval, index, visualCounter);
        } else if (index === strings.length - 1) {
            performanceFinished(visualCounter);
        }

    }, interval);
};

//Starts sounds playing
export const startPlay = strings => {
    //UI counter
    let visualCounter = createCounter(
        strings.length,
        audioCtx.currentTime.toFixed(2)
    );

    //Counter for iteration over characters of string
    let index = 0;

    let firstInterval = getRandomValue(27, 2700);

    interpreter(strings, firstInterval, index, visualCounter);
};
