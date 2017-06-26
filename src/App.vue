<template lang="html">
    <pre>{{ notesDesc }}</pre>
</template>

<script>
import {noteFrequency, noteName, keyToNote} from './notes'
import {isDef, isUndef} from './util'

export default {
    data () {
        return {
            octave: 5,
            osc: {}
        }
    },
    mounted () {
        this._audioCtx = new AudioContext({latencyHint: 'interactive'})
        this._master = this._audioCtx.createGain()
        this._master.connect(this._audioCtx.destination)
        this.osc = {}
    },
    docEvents: {
        keydown (event) {
            const key = event.key.toLowerCase()
            switch (key) {
            case 'z':
                this.octave = Math.max(3, this.octave - 1)
                break
            case 'x':
                this.octave = Math.min(12, this.octave + 1)
                break
            default:
                const baseNote = keyToNote[event.key]
                if (isUndef(baseNote)) break
                const note = baseNote + this.octave * 12
                if (isUndef(this.osc[note])) {
                    const osc = this._audioCtx.createOscillator()
                    osc.frequency.value = noteFrequency(note)
                    osc.connect(this._master)
                    osc.start()
                    this.$set(this.osc, note, osc)
                }
                break
            }

        },
        keyup () {
            const key = event.key.toLowerCase()
            const baseNote = keyToNote[key]
            if (isUndef(baseNote)) return
            for (let oct = 0; oct < 12; oct++) {
                const note = baseNote + oct * 12
                if (isDef(this.osc[note])) {
                    this.osc[note].stop()
                    this.$delete(this.osc, note)
                }
            }
        }
    },
    computed: {
        notesDesc () {
            return Object.keys(this.osc).map(n => `${noteName(n)}: ${noteFrequency(n)}`).join('\n')
        }
    }
}
</script>

<style lang="css" scoped>

</style>
