import {noteFrequency} from './notes'
import invariant from 'invariant'

export default class SynthNote {
    constructor (audioCtx, note) {
        this.osc = audioCtx.createOscillator()
        this.osc2 = audioCtx.createOscillator()
        this.osc.frequency.value = noteFrequency(note)
        this.osc2.frequency.value = noteFrequency(note) * 0.5
        this.osc2gain = audioCtx.createGain()
        this.osc2gain.gain.value = 100
        this.osc.type = 'sine'
        this.osc2.type = 'sawtooth'
    }

    playOn (target) {
        invariant(this.osc, 'osc already destroyed')
        this.osc.connect(target)
        // this.osc2.connect(target)
        this.osc2.connect(this.osc2gain)
        this.osc2gain.connect(this.osc.frequency)

        this.osc.start()
        this.osc2.start()
    }

    destroy () {
        invariant(this.osc, 'osc already destroyed')
        this.osc.stop()
        this.osc2.stop()
        this.osc = null
        this.osc2 = null
    }
}
