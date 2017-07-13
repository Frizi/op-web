import store from '../store'
import Tone from 'tone'
import {noteFrequency} from '../notes'
import R from 'ramda'
import uuid from 'uuid/v4'
console.log(Tone.TimeBase.prototype)

Tone.TimeBase.prototype._primaryExpressions.q = {
    regexp : /^(\d+)q/i,
    method (value) {
        return this._beatsToUnits(parseFloat(value));
    }

}

const clipBlobs = {

}
const clipNodes = {

}

Tone.context.updateInterval = 1/120

var masterCompressor = new Tone.Compressor();
Tone.Master.chain(masterCompressor);

// const timeline = new Tone.Timeline()

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

const startRecording = () => {
    const recorderNode = Tone.context.createMediaStreamDestination()
    const recorder = new MediaRecorder(recorderNode.stream)
    Tone.Master.connect(recorderNode)

    const clipUid = uuid()

    const chunks = []
    recorder.ondataavailable = function(evt) {
        chunks.push(evt.data);
    };
    recorder.onstop = function(evt) {
        var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        clipBlobs[clipUid] = blob

        const player = new Tone.Player(URL.createObjectURL(blob))
        clipNodes[clipUid] = player
        updateClipTimings()
    }
    recorder.start()
    return {
        stop (startBeat, endBeat) {
            recorder.stop()
            store.dispatch('createClip', {
                id: clipUid,
                beat: startBeat,
                duration: 60 * (endBeat - startBeat) / store.state.tempo
            })
        }
    }
}


function updateClipTimings () {
    store.state.clips.forEach(clip => {
        const node = clipNodes[clip.id]
        if (node) {
            node.toMaster().sync().start(new Tone.Time(clip.beat, 'q'))
        }
    })
}

let activeRecording = null
store.watch((_, g) => g.isRecording, recording => {
    if (recording) {
        if (!activeRecording) {
            activeRecording = startRecording()
        }
    } else {
        if (activeRecording) {
            activeRecording.stop(store.state.recordingStartBeat, store.state.currentTime)
            activeRecording = null
        }
    }
})

store.watch(s => s.tempo, tempo => { Tone.Transport.bpm.value = tempo })
store.watch(s => s.metre, metre => { Tone.Transport.timeSignature = metre })

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

let lastTicks = 0
Tone.Transport.scheduleRepeat((...args) => {
    lastTicks = Tone.Transport.ticks
}, '8n')

let playtickFrame = null
store.watch((_, g) => g.isPlaying, (playing) => {
    if (playing) {
        const startTime = store.state.ui.cursorPosition
        store.commit('SET_TIME', startTime)

        const unitTime = store.getters.cursorUnitTime
        Tone.Transport.start("+0", unitTime)
        Tone.Transport.schedule(playTick, unitTime)
        // playtickFrame = requestAnimationFrame(playTick)
    } else {
        for (const id in clipNodes) {
            clipNodes[id]._stop()
        }
        Tone.Transport.stop()

        Tone.Transport.ticks = store.getters.cursorTickTime
        commitBeat()
        cancelAnimationFrame(playtickFrame)
        playtickFrame = null
    }
})

function playTick() {
    if (playtickFrame) return
    playtickFrame = requestAnimationFrame(t => {
        playtickFrame = null
        playTick(t)
    })
    commitBeat()
}

const commitBeat = () => {
    const currentBeat = Tone.Transport.ticks / Tone.Transport.PPQ
    if (store.state.currentTime !== currentBeat) {
        store.commit('SET_TIME', currentBeat)
    }
}
