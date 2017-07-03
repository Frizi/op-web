<template lang="html">
    <div>
        <!-- <select v-model="oscType">
            <option value="sine">sine</option>
            <option value="square">square</option>
            <option value="sawtooth">sawtooth</option>
            <option value="triangle">triangle</option>
        </select> -->
        <pre>{{ notesDesc }}</pre>
    </div>
</template>

<script>
import {noteFrequency, noteName, keyToNote} from './notes'
import {isDef, isUndef} from './util'
import R from 'ramda'
import SynthNote from './SynthNote'
import webmidi from 'webmidi'

window.webmidi = webmidi

export default {
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
        this.setupMidi()
    },
    methods: {
        setupMidi() {
            webmidi.enable(() => {
                const instantInput = webmidi.getInputByName('Launchpad')
                const instantOutput = webmidi.getOutputByName('Launchpad')
                instantInput && this.connectMidiInput(instantInput)
                instantOutput && this.connectMidiOutput(instantOutput)

                webmidi.addListener('connected', (e) => {
                    if (e.name.indexOf('Launchpad') >= 0) {
                        if (e.input) {
                            this.connectMidiInput(e.input)
                        }
                        if (e.output) {
                            this.connectMidiOutput(e.output)
                        }
                    }
                })
            })
        },
        connectMidiInput (input) {
            console.log('connectMidiInput')
            if (this.midiInput === input) return
            this.midiInput = input
            this.midiInput.addListener('noteon', "all", (e) => {
                this.$set(this.extMidiState, e.note.number, true)
            })
            this.midiInput.addListener('noteoff', "all", (e) => {
                this.$set(this.extMidiState, e.note.number, false)
            })
        },
        connectMidiOutput (output) {
            if (this.midiOutput === output) return

            console.log('connectMidiOutput')
            this.midiOutput = output
            this.midiOutput.sendControlChange(0, 0)
            this.midiOutput.sendControlChange(0, 2)
        },
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
        },
        notesDesc () {
            return this.playingNotes.map(n => `${noteName(n)}: ${noteFrequency(n)}`).join('\n')
        }
    }
}

const diff = (a, b) => a - b
</script>

<style lang="css" scoped>

</style>
