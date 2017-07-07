<template lang="html">
    <ArrangementPanel />
</template>

<script>
import {noteFrequency, noteName, keyToNote} from './notes'
import {isDef, isUndef} from './util'
import R from 'ramda'
import SynthNote from './SynthNote'
import webmidi from 'webmidi'

import store from './store'

import ArrangementPanel from './components/ArrangementPanel'

window.webmidi = webmidi

export default {
    store,
    components: {
        ArrangementPanel
    },
    data () {
        return {
            octave: 5,
            oscType: 'square',
            keyboardState: {},
            extMidiState: {}
        }
    },
    mounted () {
        this._audioCtx = new AudioContext({latencyHint: 'interactive'})
        this._master = this._audioCtx.createGain()
        this._outCompress = this._audioCtx.createDynamicsCompressor()

        this._master.connect(this._outCompress)
        this._outCompress.connect(this._audioCtx.destination)
        this._synths = {}
        this.midiInput = null
        this.midiOutput = null
    },
    methods: {
        noteName,
        createOsc (note) {
            if (isUndef(this._synths[note])) {
                const synth = new SynthNote(this._audioCtx, note)
                synth.playOn(this._master)
                this.$set(this._synths, note, synth)
            }
        },
        removeOsc (note) {
            if (isDef(this._synths[note])) {
                this._synths[note].destroy()
                delete this._synths[note]
            }
        }
    },
    docEvents: {
        keydown (event) {
            const key = event.key.toLowerCase()
            switch (key) {
            case 'z':
                this.octave = Math.max(0, this.octave - 1)
                break
            case 'x':
                this.octave = Math.min(10, this.octave + 1)
                break
            default:
                this.$set(this.keyboardState, key, true)
                break
            }
        },
        keyup () {
            const key = event.key.toLowerCase()
            switch (key) {
                case 'z':
                case 'x':
                    break
                default:
                    this.$set(this.keyboardState, key, false)
            }
        }
    },
    watch: {
        playingNotes (newNotes, oldNotes) {
            const addedNotes = R.difference(newNotes, oldNotes)
            const removedNotes = R.difference(oldNotes, newNotes)
            addedNotes.forEach(n => {
                this.createOsc(n)
                this.midiOutput && this.midiOutput.playNote(n, 1, {velocity: 1})
            })
            removedNotes.forEach(n => {
                this.removeOsc(n)
                this.midiOutput && this.midiOutput.stopNote(n, 1)

            })
        }
    },
    computed: {
        playingNotes () {
            const oct = this.octave * 12
            const keysDown = Object.keys(this.keyboardState).filter(k => !!this.keyboardState[k])
            const keyboardNotes = keysDown
                .map(k => keyToNote[k])
                .filter(isDef)
                .map(n => n + oct)

            const midiNotes = Object.keys(this.extMidiState).filter(k => !!this.extMidiState[k])

            return R.pipe(
                R.uniq,
                R.sort(diff),
                R.filter(R.both(R.lte(0), R.gte(127)))
            )([...keyboardNotes, ...midiNotes])
        }
    }
}

const diff = (a, b) => a - b
</script>

<style lang="scss">

@import "./core";
@import "./layout";

html, body {
    margin: 0;
    width: 100%;
    height: 100%;
    font-size: 9px;
    font-family: Arial, sans-serif;
    background: black;
    overflow: hidden;
}

</style>
