import store from '../store'
import Tone from 'tone'
import {noteFrequency} from '../notes'
import R from 'ramda'
import uuid from 'uuid/v4'

import signalUrl from 'url-loader!../assets/StartSignal.wav'

Tone.TimeBase.prototype._primaryExpressions.q = {
    regexp : /^(\d+)q/i,
    method (value) {
        return this._beatsToUnits(parseFloat(value));
    }

}

const def = Tone.TimeBase.prototype._primaryExpressions.default
delete Tone.TimeBase.prototype._primaryExpressions.default
Tone.TimeBase.prototype._primaryExpressions.default = def

const clipBlobs = {

}
const clipNodes = {

}

Tone.context.updateInterval = 1/120

var masterCompressor = new Tone.Compressor();
Tone.Master.chain(masterCompressor);

var synthGain = new Tone.Gain().toMaster()

var stereo = new Tone.StereoWidener(0.3).connect(synthGain);
var reverb = new Tone.Freeverb(0.4).connect(stereo);
var chorus = new Tone.Chorus(4, 1.1, 0.5).connect(reverb);
var pingPong = new Tone.PingPongDelay(0.01, 0.2).connect(chorus);
var synthPrefx = new Tone.Gain(0.25).connect(pingPong)

reverb.wet.value = 0.3;

// const timeline = new Tone.Timeline()

// var synth = new Tone.PolySynth(4, Tone.Sampler, signalUrl).toMaster();
var synth = new Tone.PolySynth(4, Tone.Synth)
    .connect(synthPrefx);
synth.set({
    // loop: true,
    "oscillator" : {
        "type" : "sine",
        "modulationFrequency" : 0.2
    },
    "envelope" : {
        "attack" : 0.01,
        "decay" : 0,
        "sustain" : 1,
        "release" : 0.5,
    }
})

const metronomeSynth = new Tone.Synth({
    "oscillator" : {
        "type" : "sine",
    },
    volume: -12,
    "envelope" : {
        "attack" : 0.001,
        "decay" : 0,
        "sustain" : 1,
        "release" : 0.05,
    }
}).toMaster()

const metronome = new Tone.Loop(function(time){
    if (store.state.metronome) {
        const majorBeat = 0 === Math.round((Tone.Transport.seconds * store.state.tempo) / 60) % Tone.Transport.timeSignature
        metronomeSynth.triggerAttackRelease(majorBeat ? 800 : 600, 0.02, time)
    }
}, "1q").start(0);

// const recorderNode = Tone.context.createMediaStreamDestination()
// const recorder = new MediaRecorder(recorderNode.stream, { videoBitsPerSecond: 0 })
// Tone.Master.connect(recorderNode)

const audioCtx = Tone.context._context
window.ctx = audioCtx
const recorderNode = Tone.context.createScriptProcessor(512, 2, 2);
const pullingAnalyser = Tone.context.createAnalyser()
pullingAnalyser.fftSize = 32 // minimal possible

const blobToBuffer = blob => new Promise(res => {
    var fileReader = new FileReader();
    fileReader.onload = function() { res(this.result) };
    fileReader.readAsArrayBuffer(blob);
})


import workerScript from 'url-loader!./recordWorker'
const recordWorker = new Worker(workerScript)
const startRecording = () => {
    // force pull through script processor
    recorderNode.onaudioprocess = audioProcess
    recorderNode.connect(pullingAnalyser)
    synthGain.connect(recorderNode)

    const clipUid = uuid()
    let finished = false
    let startBeat = null
    let endBeat = null
    const chunksL = []
    const chunksR = []
    function audioProcess(buf) {
        const left = event.inputBuffer.getChannelData(0).buffer
        const right = event.inputBuffer.getChannelData(1).buffer
        recordWorker.postMessage({
            type: 'data',
            left, right
        })
        if (finished) {
            recorderNode.onaudioprocess = null
            requestIdleCallback(finish)
        }
    };


    function finish () {
        recorderNode.disconnect(pullingAnalyser)
        synthGain.disconnect(recorderNode)
        recordWorker.postMessage({type: 'end', id: clipUid})

        recordWorker.onmessage = e => {
            recordWorker.onmessage = null
            const data = e.data
            const audioBuffer = audioCtx.createBuffer(2, data.left.byteLength/4, audioCtx.sampleRate)
            audioBuffer.copyToChannel(new Float32Array(data.left), 0)
            audioBuffer.copyToChannel(new Float32Array(data.right), 1)

            const player = new Tone.Player(audioBuffer)
            clipNodes[clipUid] = player
            store.dispatch('createClip', {
                id: clipUid,
                beat: startBeat,
                duration: 60 * (endBeat - startBeat) / store.state.tempo
            })
            updateClipTimings()
        }

        // if (chunksL.length > 0) {
        //     const bufLen = chunksL[0].length
        //     const buf = audioCtx.createBuffer(2, bufLen * chunksL.length, audioCtx.sampleRate)
        //     for(let c = 0; c < 2; c++) {
        //         const channel = buf.getChannelData(c);
        //         const chunks = c === 0 ? chunksL : chunksR
        //
        //         let pos = 0
        //         for (let i = 0; i < chunks.length; i++) {
        //             channel.set(chunks[i], pos)
        //             pos += bufLen
        //         }
        //         console.log(channel.findIndex(x => x !== 0))
        //     }
        //     chunksL.length = 0
        //     chunksR.length = 0
        // }

        // var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        // clipBlobs[clipUid] = blob
        // console.log(blob)
        // const player = new Tone.Player(URL.createObjectURL(blob), () => {
        //     const id = player.buffer._buffer.getChannelData(0).findIndex(x => x !== 0)
        //     console.log(id, player.buffer._buffer.getChannelData(0))
        //     clipNodes[clipUid] = player
        //     updateClipTimings()
        // })
        // clipNodes[clipUid] = player
        //
        // store.dispatch('createClip', {
        //     id: clipUid,
        //     beat: startBeat,
        //     duration: 60 * (endBeat - startBeat) / store.state.tempo
        // })

    }



    // recorder.onstop = function(evt) {
    //     var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
    //     clipBlobs[clipUid] = blob
    //
    //     const player = new Tone.Player(URL.createObjectURL(blob), () => {
    //         const id = player.buffer._buffer.getChannelData(0).findIndex(x => x !== 0)
    //         console.log(id, player.buffer._buffer.getChannelData(0))
    //         clipNodes[clipUid] = player
    //         updateClipTimings()
    //     })
    // }
    // recorder.start()
    return {
        stop (_startBeat, _endBeat) {
            finished = true
            startBeat = _startBeat
            endBeat = _endBeat
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
        const startTimeObj = new Tone.Time(startTime, 'q')
        Tone.Transport.start("+0", startTimeObj)
        Tone.Transport.schedule(playTick, startTimeObj)
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
    const currentBeat = (Tone.Transport.seconds - Tone.context.lookAhead) * Tone.Transport.bpm.value / 60
    if (store.state.currentTime !== currentBeat) {
        store.commit('SET_TIME', currentBeat)
    }
}
