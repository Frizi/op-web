<script>
import {mapActions} from 'vuex'
import {keyToNote} from '../notes'
import {isDef} from '../util'
import R from 'ramda'

export default {
    render: () => null,
    data () {
        return {
            octave: 5,
            keyboardState: {}
        }
    },
    computed: {
        inputId () {
            return '_KEYBOARD_' + this._uid
        },
        playingNotes () {
            const oct = this.octave * 12
            return Object.keys(this.keyboardState)
                .filter(k => !!this.keyboardState[k])
                .map(k => keyToNote[k])
                .filter(isDef)
                .map(n => n + oct)
                .filter(n => n < 128 && n >= 0)
        }
    },
    docEvents: {
        keydown (event) {
            if (event.shiftKey || event.altKey || event.metaKey) return;

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
                this.midiNoteon({inputId: this.inputId, noteNumber: n, velocity: 127})
            })
            removedNotes.forEach(n => {
            this.midiNoteoff({inputId: this.inputId, noteNumber: n})
            })
        }
    },
    methods: {
        ...mapActions(['midiNoteon', 'midiNoteoff', 'midiConnectVirtualInput', 'midiDisconnectVirtualInput'])
    },
    mounted () {
        this.midiConnectVirtualInput({id: this.inputId, name: 'Keyboard'})
    },
    destroy () {
        this.midiDisconnectVirtualInput({id: this.inputId})
    }
}
</script>
