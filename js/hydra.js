import { mapping } from "./utilities.js";

export const hydraVisuals = (strings) => {
	let hydra = new Hydra({
		canvas: document.getElementById('hydraCanvas'),
		detectAudio: false,
	}); 

	let num = mapping(totalCharacters, characterCode, 10, 1);
	
	
	let v0 = ()=>Math.sin(time) * 2
	let v1 = ()=>Math.cos(time)
	
	noise(5, 0.3)
	
	osc(num, 0.01)
	.modulatePixelate(noise(v0, 0).pixelate(8,8),611,8)
	.out(o0);
	
	s1.initCam()
	src(s1)
	.out(o1)
	
	src(o0).modulate(o1).out(o2)
	
	render(o2);
}