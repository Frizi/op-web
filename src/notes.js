import R from 'ramda'

const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "H", "C_NEXT"];

export function noteFrequency ( note ) {
	return 440 * Math.pow(2,(note-69)/12);
}

export function noteName ( note ) {
	return noteStrings[note % 12] + (Math.floor(note / 12) - 1)
}

export const keyToNote = R.map(R.indexOf(R.__, noteStrings), {
    a: 'C',
    w: 'C#',
	s: 'D',
	e: 'D#',
	d: 'E',
	f: 'F',
	t: 'F#',
	g: 'G',
	y: 'G#',
	h: 'A',
	u: 'A#',
	j: 'H',
	k: 'C_NEXT'
})
