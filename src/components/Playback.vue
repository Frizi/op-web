<template lang="html">
    <div class="cage">
        <slot/>
        <div :class="`marker ${cursorState}`"/>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    region: {
        type: Array,
        required: true
    },
    showBeats: {
        type: Number,
        required: true
    },
    data () {
        return {
            playTime: 0
        }
    },
    computed: {
        ...mapGetters(['cursorPosition', 'playbackData']),
        cursorState () {
            const p = this.playbackData
            if (p.playTimestamp) {
                if (p.recording) {
                    return 'recording'
                }
                return 'playing'
            }
            if (p.recording) {
                return 'awaiting-record'
            }
            return 'rest'
        },
        finalCursorPos () {

        }
    },
    watch: {
        playTimestamp (t) {
            if (this.playTime === null) {
                this.onPlayStart()
            } else {
                this.onPlayEnd()
            }
        }
    },
    methods: {
        ...mapActions(['startPlaying', 'stopPlaying', 'setCursor']),

        recalculateRegion () {
            // when playing, keep cursor on the center of view
            const [start, end] = this.region

        },
    }
}
</script>

<style scoped lang="scss">
@import "../core";

.cage {
    position: relative;
}

.marker {

    &.rest { color: $theme-1; }
    &.playing { color: $theme-2; }
    &.awaiting-record { color: $theme-4; }
    &.recording { color: $theme-4; }

    width: 1px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 20px;
    background: currentColor;

    &:before {
        content: '';
        top: 0;
        position: absolute;
        left: -3px;
        right: -3px;
        height: 0;
        border: ($unit-half - 0.5) solid transparent;
        border-top-color: currentColor;
        border-bottom-width: 0;
        border-top-width: $unit * 0.66;
    }
}
</style>
