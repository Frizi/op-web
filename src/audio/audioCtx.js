import store from '../store'
import Tone from 'tone'
import {noteFrequency} from '../notes'
import R from 'ramda'

const recordClip = ''

const clipsBackingStore = {

}

var synth = new Tone.PolySynth(4, Tone.Synth).toMaster();


store.watch((_, g) => g.allActiveNotes, (notes, oldNotes) => {
    const release = R.difference(R.pluck('number', oldNotes), R.pluck('number', notes))

    notes.forEach(note => {
        const oldNote = oldNotes.find(R.propEq('number', note.number))
        if (oldNote && oldNote.velocity !== note.velocity) {
            synth.triggerRelease(noteFrequency(number))
            synth.triggerAttack(noteFrequency(note.number), null, note.velocity / 127)
        }
        if (!oldNote) {
            synth.triggerAttack(noteFrequency(note.number), null, note.velocity / 127)
        }
    })
    release.forEach((n) => {
        synth.triggerRelease(noteFrequency(n))
    })
})
