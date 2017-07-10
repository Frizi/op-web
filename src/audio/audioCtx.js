import store from '../store'
import Tone from 'tone'
import {noteFrequency} from '../notes'
import R from 'ramda'

const clipNodes = {

}

var masterCompressor = new Tone.Compressor();
Tone.Master.chain(masterCompressor);

var synth = new Tone.PolySynth(4, Tone.Synth).toMaster();
synth.set({
    "oscillator" : {
        "type" : "pwm",
        "modulationFrequency" : 0.2
    },
    "envelope" : {
        "attack" : 0.02,
        "decay" : 0.1,
        "sustain" : 0.2,
        "release" : 0.9,
    }
})

const recorderNode = Tone.context.createMediaStreamDestination()
const recorder = new MediaRecorder(recorderNode.stream)
Tone.Master.connect(recorderNode)

let chunks = []
recorder.ondataavailable = function(evt) {
    chunks.push(evt.data);
};

recorder.onstop = function(evt) {
    var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
    chunks = []
    const audioEl = document.querySelector("audio")
    audioEl.src = URL.createObjectURL(blob)
    audioEl.play()
}

store.watch((_, g) => g.isRecording, recording => {
    if (recording) {
        recorder.start()
    } else {
        recorder.stop()
    }
})

store.watch(s => s.tempo, tempo => { Tone.Transport.bpm.value = tempo })
store.watch(s => s.metre, metre => { Tone.Transport.bpm.timeSignature = metre })



store.watch((_, g) => g.allActiveNotes, (notes, oldNotes) => {
    const release = R.difference(R.pluck('number', oldNotes), R.pluck('number', notes))

    notes.forEach(note => {
        const oldNote = oldNotes.find(R.propEq('number', note.number))
        if (oldNote && oldNote.velocity !== note.velocity) {
            synth.triggerRelease(noteFrequency(note.number))
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

Tone.Transport.start()
let lastTicks = 0
Tone.Transport.scheduleRepeat((...args) => {
    lastTicks = Tone.Transport.ticks
}, '8n')
