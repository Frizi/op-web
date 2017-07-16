<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    render: () => null,
    methods: {
        ...mapActions([
            'setPlaying',
            'setActiveTape',
            'toggleMetronome'
        ])
    },
    computed: {
        ...mapGetters([
            'isPlaying',
            'tapes'
        ])
    },
    keys: {
        Space () { this.setPlaying(!this.isPlaying) },
        KeyM () { this.toggleMetronome() },
        Digit1 () { this.tapes[0] && this.setActiveTape(this.tapes[0].id) },
        Digit2 () { this.tapes[1] && this.setActiveTape(this.tapes[1].id) },
        Digit3 () { this.tapes[2] && this.setActiveTape(this.tapes[2].id) },
        Digit4 () { this.tapes[3] && this.setActiveTape(this.tapes[3].id) },
    },
    docEvents: {
        keypress (e) {
            const handler = this.$options.keys[e.code]
            if (handler) handler.call(this, e)
        }
    }

}
</script>
