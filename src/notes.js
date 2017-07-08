const noteStrings = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function noteFrequency (note) {
  return 440 * Math.pow(2, (note - 69) / 12)
}

export function noteName (note) {
  return noteStrings[note % 12] + (Math.floor(note / 12) - 2)
}

export const keyToNote = {
  a: 0, // C
  w: 1,
  s: 2,
  e: 3,
  d: 4,
  f: 5,
  t: 6,
  g: 7,
  y: 8,
  h: 9,
  u: 10,
  j: 11,
  k: 12,
  o: 13,
  l: 14
}
