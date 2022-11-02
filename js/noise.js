/*
*   Module for noise generator.
*/

import { audioCtx, gainNode } from './audio.js';

/* UI */
const noiseOnBtn = document.querySelector('#on-noise');
const noiseOffBtn = document.querySelector('#off-noise');
export const noiseVolumeInput = document.querySelector('#noise-volume');
export const noiseFilterCutInput = document.querySelector('#noise-filter-cut');
export const noiseFilterResInput = document.querySelector('#noise-filter-res');
export const noiseLFOTypeSelect = document.querySelector('#noise-lfo-type');
export const noiseLFOAmtInput = document.querySelector('#noise-lfo-amt');
export const noiseLFORateInput = document.querySelector('#noise-lfo-rate');

//Noise params interface
//This is for setting all values even if noise generator is off
export const noiseParams = {
    volume: noiseVolumeInput.value,
    filter: {
        cut: noiseFilterCutInput.value,
        res: noiseFilterResInput.value,
    },
    lfo: {
        type: noiseLFOTypeSelect.value,
        amt: noiseLFOAmtInput.value,
        rate: noiseLFORateInput.value,
    },
};

//Brown Noise
export let brownNoise;
//Brown Noise volume
export const noiseGainNode = audioCtx.createGain();
noiseGainNode.gain.setTargetAtTime(noiseParams.volume, audioCtx.currentTime, 0);
noiseGainNode.connect(gainNode.gain);

//Noise filter
const noiseFilter = audioCtx.createBiquadFilter();
noiseFilter.frequency.setTargetAtTime(
    noiseParams.filter.cut,
    audioCtx.currentTime,
    0.1
);
noiseFilter.Q.setTargetAtTime(
    noiseParams.filter.res,
    audioCtx.currentTime,
    0.1
);
noiseFilter.connect(noiseGainNode);

//Filter controls
export const setNoiseFilterCut = value => {
    noiseParams.filter.cut = value;
    if (audioCtx && noiseFilter) {
        noiseFilter.frequency.exponentialRampToValueAtTime(
            value,
            audioCtx.currentTime + 0.2
        );
    }
};

noiseFilterCutInput.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    setNoiseFilterCut(value);
});

export const setNoiseFilterRes = value => {
    noiseParams.filter.res = value;

    if (audioCtx && noiseFilter) {
        noiseFilter.Q.value = value;
    }
};

noiseFilterResInput.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    setNoiseFilterRes(value);
});

//Create noise generator
//Based on https://noisehack.com/generate-noise-web-audio-api/
export const createBrownNoise = function () {
    const bufferSize = 4096;
    let lastOut = 0.0;
    brownNoise = audioCtx.createScriptProcessor(bufferSize, 1, 1);
    brownNoise.onaudioprocess = function (e) {
        let output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // (roughly) compensate for gain
        }
    };
    brownNoise.connect(noiseFilter);
};

//Brown Noise UI
export const setNoiseVolume = value => {
    noiseParams.volume = value;

    if (audioCtx && noiseGainNode) {
        noiseGainNode.gain.linearRampToValueAtTime(
            value,
            audioCtx.currentTime + 0.01
        );
    }
};

noiseVolumeInput.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    setNoiseVolume(value);
});

noiseOnBtn.addEventListener('click', () => {
    createBrownNoise();
    noiseOnBtn.classList.add('play');
});

noiseOffBtn.addEventListener('click', () => {
    noiseOnBtn.classList.remove('play');
    if (brownNoise) {
        brownNoise.disconnect(noiseGainNode);
    }
});

//Noise LFO
const noiseLFOGain = audioCtx.createGain();
noiseLFOGain.gain.setTargetAtTime(noiseParams.lfo.amt, audioCtx.currentTime, 0);
noiseLFOGain.connect(noiseGainNode.gain);
noiseLFOGain.connect(noiseFilter.frequency);

const createLFO = (type, connection) => {
    let lfo = audioCtx.createOscillator();
    lfo.type = type;
    lfo.frequency.value = noiseParams.lfo.rate;
    lfo.start();
    lfo.connect(connection);
    return lfo;
};

const noiseLFO = createLFO(noiseParams.lfo.type, noiseLFOGain);

export const setNoiseLFORate = value => {
    noiseParams.lfo.rate = value;

    if (audioCtx && noiseLFO) {
        noiseLFO.frequency.value = value;
    }
};

noiseLFORateInput.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    setNoiseLFORate(value);
});

export const setNoiseLFOAmount = value => {
    noiseParams.lfo.amt = value;

    if (audioCtx && noiseLFO) {
        noiseLFOGain.gain.linearRampToValueAtTime(
            value,
            audioCtx.currentTime + 0.01
        );
    }
};

noiseLFOAmtInput.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    setNoiseLFOAmount(value);
});

noiseLFOTypeSelect.addEventListener('change', e => {
    let value = e.target.value;
    noiseParams.lfo.type = value;
    if (audioCtx && noiseLFO) {
        noiseLFO.type = value;
    }
});
