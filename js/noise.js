import { audioCtx, gainNode } from "./audio.js";

//Inputs
const noiseOnBtn = document.querySelector('#on-noise');
const noiseOffBtn = document.querySelector('#off-noise');
const noiseGainControl = document.querySelector('#noise-gain');
const noiseFilterCutControl = document.querySelector('#noise-filter-cut');
const noiseFilterResControl = document.querySelector('#noise-filter-res');
const noiseLFOTypeSelect = document.querySelector('#noise-lfo-type');
const noiseLFOAmtControl = document.querySelector('#noise-lfo-amt');
const noiseLFORateControl = document.querySelector('#noise-lfo-rate');


//Noise params interface
const noiseParams = {
    volume: noiseGainControl.value,
    filter: {
        cut: noiseFilterCutControl.value,
        res: noiseFilterResControl.value
    },
    lfo: {
        type: noiseLFOTypeSelect.value,
        amt: noiseLFOAmtControl.value,
        rate: noiseLFORateControl,
    }
}

//Noise filter
const noiseFilter = audioCtx.createBiquadFilter();
noiseFilter.frequency.setTargetAtTime(noiseParams.filter.cut, audioCtx.currentTime, 0.1);
noiseFilter.Q.setTargetAtTime(noiseParams.filter.res, audioCtx.currentTime, 0.1);
noiseFilter.connect(gainNode.gain);

//Filter controls
noiseFilterCutControl.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    noiseParams.filter.cut = value;

    if (audioCtx && noiseFilter) {
        noiseFilter.frequency.exponentialRampToValueAtTime(
            value,
            audioCtx.currentTime + 0.2
        );
    }
});

noiseFilterResControl.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    noiseParams.filter.res = value;

    if (audioCtx && noiseFilter) {
        noiseFilter.Q.value = value;
    }
});

//Brown Noise
export let brownNoise;
//Brown Noise volume
export const noiseGainNode = audioCtx.createGain();
noiseGainNode.gain.setTargetAtTime(noiseParams.volume, audioCtx.currentTime, 0);
noiseGainNode.connect(noiseFilter);

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
    brownNoise.connect(noiseGainNode);
};

//Brown Noise UI
noiseGainControl.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    noiseParams.volume = value;

    if (audioCtx && noiseGainNode) {
        noiseGainNode.gain.linearRampToValueAtTime(
            value,
            audioCtx.currentTime + 0.01
        );
    }
});

noiseOnBtn.addEventListener('click', () => {
    createBrownNoise();
    noiseOnBtn.classList.add('play');
});
noiseOffBtn.addEventListener('click', () => {
    noiseOnBtn.classList.remove('play');
    if(brownNoise) {
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
    lfo.frequency.value = 0;
    lfo.start();
    lfo.connect(connection);
    return lfo;
}

const noiseLFO = createLFO(noiseParams.lfo.type, noiseLFOGain);

noiseLFORateControl.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    noiseParams.lfo.rate = value;

    if (audioCtx && noiseLFO) {
        noiseLFO.frequency.value = value;
    }
});

noiseLFOAmtControl.addEventListener('input', e => {
    let value = parseFloat(e.target.value);
    noiseParams.lfo.amt = value;

    if (audioCtx && noiseLFO) {
        noiseLFOGain.gain.linearRampToValueAtTime(
            value,
            audioCtx.currentTime + 0.01
        );
    }
});

noiseLFOTypeSelect.addEventListener('change', (e) => {
    let value = e.target.value;
    noiseParams.lfo.type = value;
    if(audioCtx && noiseLFO) {
        noiseLFO.type = value;
    }
});

