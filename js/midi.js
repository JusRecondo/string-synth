/*
*  Module for MIDI configuration and mapping.
*/

import {
    densityInput,
    filterCutInput,
    filterResInput,
    setFilterCut,
    setFilterRes,
    setMasterVolume,
    volumeInput,
} from './audio.js';
import {
    noiseFilterCutInput,
    noiseFilterResInput,
    noiseLFOAmtInput,
    noiseLFORateInput,
    noiseVolumeInput,
    setNoiseFilterCut,
    setNoiseFilterRes,
    setNoiseLFOAmount,
    setNoiseLFORate,
    setNoiseVolume,
} from './noise.js';
import { reverseNumber } from './utilities.js';

export const initMIDI = () => {
    /* UI */
    const midiInfo = document.querySelector('#midiInfo');
    const midiMapConfig = document.querySelector('form#midiMapConfig');
    const midiDestination = document.querySelector('select#midiDestination');
    const midiCC = document.querySelector('input#midiCC');
    const midiMapInfo = document.querySelector('#midiMapInfo');
    const midiWarning = document.querySelector('#midiWarning');
    const clearCC = document.querySelector('#clearCC');
    const clearAllMidi = document.querySelector('#clearAllMidi');
    const confirmClear = document.querySelector('#confirm');
    const cancelClear = document.querySelector('#cancel');

    /*
     *   Web MIDI API
     */
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDIsuccess, onMIDIfailure);
    }

    function onMIDIsuccess(midi) {
        if (midi.inputs.size !== 0) {
            //check for user's midi config stored in browser
            let midiConfig = getMidiMapping();

            if (!midiConfig) {
                midiInfo.innerText = 'Device connected!- Map your controller';
            } else {
                midiInfo.innerText =
                    'Device connected!- Edit or clear your MIDI mapping';
            }
        } else {
            midiInfo.innerText =
                'No device connected, connect your device and reload page.';
        }

        let inputs = midi.inputs.values();

        for (
            let input = inputs.next();
            input && !input.done;
            input = inputs.next()
        ) {
            input.value.onmidimessage = onMIDIMessage;
        }
    };

    function onMIDIfailure() {
        console.error('Midi is not available in the browser.');
    };

    /* Success! -> onMIDIMessage */
    function onMIDIMessage(message) {
        //MIDI CC config

        //Display midi CC for user
        midiCC.value = message.data[1];

        //Get user's midi config stored in browser
        let midiConfig = getMidiMapping();

        //Send midi to synth controls
        if (midiConfig !== null) {
            //midi to master volume
            if (
                midiConfig['Volume'] &&
                message.data[1] == midiConfig['Volume']
            ) {
                let value = midiCCMap(message.data[2], 0, 1);
                volumeInput.value = value;
                setMasterVolume(value);
            }

            //midi to density control
            if (
                midiConfig['Density'] &&
                message.data[1] == midiConfig['Density']
            ) {
                let value = midiCCMap(message.data[2], 540, 2700);
                value = reverseNumber(value, 2700, 540);
                densityInput.value = value;
            }

            //midi to filter cut
            if (
                midiConfig['Filter Cut'] &&
                message.data[1] == midiConfig['Filter Cut']
            ) {
                let value = midiCCMap(message.data[2], 500, 12000);
                filterCutInput.value = value;
                setFilterCut(value);
            }

            //midi to filter resonance
            if (
                midiConfig['Filter Res'] &&
                message.data[1] == midiConfig['Filter Res']
            ) {
                let value = midiCCMap(message.data[2], 0.01, 30);
                filterResInput.value = value;
                setFilterRes(value);
            }

            //midi to noise volume
            if (
                midiConfig['Noise Volume'] &&
                message.data[1] == midiConfig['Noise Volume']
            ) {
                let value = midiCCMap(message.data[2], 0, 1);
                noiseVolumeInput.value = value;
                setNoiseVolume(value);
            }

            //midi to noise filter cut
            if (
                midiConfig['Noise Filter Cut'] &&
                message.data[1] == midiConfig['Noise Filter Cut']
            ) {
                let value = midiCCMap(message.data[2], 100, 12000);
                noiseFilterCutInput.value = value;
                setNoiseFilterCut(value);
            }

            //midi to noise filter resonance
            if (
                midiConfig['Noise Filter Res'] &&
                message.data[1] == midiConfig['Noise Filter Res']
            ) {
                let value = midiCCMap(message.data[2], 0.01, 30);
                noiseFilterResInput.value = value;
                setNoiseFilterRes(value);
            }

            //midi to noise LFO rate
            if (
                midiConfig['Noise LFO Rate'] &&
                message.data[1] == midiConfig['Noise LFO Rate']
            ) {
                let value = midiCCMap(message.data[2], 0, 20);
                noiseLFORateInput.value = value;
                setNoiseLFORate(value);
            }

            //midi to LFO AMT
            if (
                midiConfig['Noise LFO Amount'] &&
                message.data[1] == midiConfig['Noise LFO Amount']
            ) {
                let value = midiCCMap(message.data[2], 0, 1);
                noiseLFOAmtInput.value = value;
                setNoiseLFOAmount(value);
            }
        }
    };

    /* Map MIDI CC to any range */
    function midiCCMap(value, min, max) {
        return ((value / 127) * (max - min) + min).toFixed(2);
    };

    /*
     *  MIDI mapping and storage
     */
    function startMidiMapping(e) {
        e.preventDefault();

        if (!midiDestination || !midiCC.value) {
            midiMapInfo.innerText =
                'Please, enter a Midi Destination and Midi CC values.';
        } else {
            saveMidiMapping(midiDestination.value, midiCC.value);
        }
    };

    midiMapConfig.addEventListener('submit', startMidiMapping);

    /* Save MIDI Mapping in local storage*/
    const localStorage = window.localStorage;
    function saveMidiMapping(param, value) {
        const paramConfig = {
            [param]: value,
        };

        let synthMIDI = getMidiMapping();

        if (synthMIDI !== null) {
            /* check if MIDI CC is already assigned */
            if (Object.values(synthMIDI).includes(value)) {
                let paramAssigned = Object.keys(synthMIDI).find(
                    key => synthMIDI[key] == value
                );
                midiWarning.innerText = `MIDI CC ${value} already assigned to ${paramAssigned}, select another CC or clear mapping`;
                clearCC.hidden = false;
                clearCC.addEventListener('click', () => {
                    delete synthMIDI[paramAssigned];
                    localStorage.setItem(
                        'synthMIDI',
                        JSON.stringify(synthMIDI)
                    );
                    midiWarning.innerText = 'Cleared!';
                    clearCC.hidden = true;
                });
            } else {
                synthMIDI[param] = value;
                midiWarning.innerText = `MIDI CC ${value} assigned to ${param}`;
            }

            localStorage.setItem('synthMIDI', JSON.stringify(synthMIDI));
        } else {
            localStorage.setItem('synthMIDI', JSON.stringify(paramConfig));
            midiWarning.innerText = `MIDI CC ${value} assigned to ${param}`;
        }
    };

    /* Get User's MIDI Mapping */
    function getMidiMapping() {
        let synthMIDI = localStorage.getItem('synthMIDI');
        synthMIDI = JSON.parse(synthMIDI);

        return synthMIDI;
    };

    /* Clear MIDI Mapping  */
    clearAllMidi.addEventListener('click', () => {
        confirmClear.hidden = false;
        cancelClear.hidden = false;
    });

    cancelClear.addEventListener('click', () => {
        confirmClear.hidden = true;
        cancelClear.hidden = true;
    });

    confirmClear.addEventListener('click', () => {
        localStorage.removeItem('synthMIDI');
        midiInfo.innerText = "Device connected!- Map your controller's MIDI CC";
    });
};
