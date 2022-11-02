import { densityInput, filterCutInput, volumeInput } from "./audio.js";
import { noiseLFORateInput, noiseVolumeInput } from "./noise.js";
import { mapping, characters, reverseNumber } from "./utilities.js";

export const initHydraVisuals = () => {
	let hydra = new Hydra({
		canvas: document.getElementById('hydraCanvas'),
		detectAudio: false,
	}); 

	let v0 = ()=>Math.sin(time) / 2;
	let v1 = ()=>Math.cos(time);

	//Data from synth
	const totalCharacters = Object.keys(characters).length;
	const characterCodesArray = Object.values(characters);

	let noiseVolume = () => {
		let input = noiseVolumeInput.value;
		let value = mapping(1, input, 1, 0.01);
		value = Number(value);

		return value;
	}

	let noiseLFO = () => {
		let input = noiseLFORateInput.value;
		let value = Math.floor(mapping(20, input, 5, 0));
		value = Number(value);
		return value;
	}

	let density = () => {
		let input = parseFloat(densityInput.value);
		input = reverseNumber(input, 2700, 540);
		let value = Math.floor(mapping(2700, input, 20, 5));
		return value;
	}
	
	
	noise(density, noiseLFO)
	.modulatePixelate(noise(1).pixelate(density, noiseVolume),1024,8)
	.out(o0);

	s1.initScreen();

	src(s1).out(o1);
	
	src(o0).modulate(o1, noiseVolume).out(o2);
	
	render(o2);
}

