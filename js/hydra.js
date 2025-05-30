import { densityInput } from "./audio.js";
import { noiseLFORateInput, noiseVolumeInput } from "./noise.js";
import { mapping, reverseNumber } from "./utilities.js";

export const initHydraVisuals = () => {
	let hydra = new Hydra({
		canvas: document.getElementById('hydraCanvas'),
		detectAudio: false,
	}); 

	//Data from synth interface
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
		input = reverseNumber(input, 5000, 540);
		let value = Math.floor(mapping(5000, input, 20, 5));
		return value;
	}
		
	noise(density, noiseLFO)
	.modulatePixelate(noise(1).pixelate(density, noiseVolume),1024,8)
	.out(o0);
	
	src(o0).modulate(o1, noiseVolume).out(o2);
	
	render(o2);
}

