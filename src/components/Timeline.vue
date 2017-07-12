<template lang="html">
    <div class="cage" @mousedown="handleMouse">
        <slot/>
        <TimelineMarker v-if="isPlaying" :region="region" :position="cursorPosition" state="default"/>
        <TimelineMarker :region="region" :position="currentTime" :state="markerState"/>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import TimelineMarker from './TimelineMarker'
import R from 'ramda'

export default {
    components: {
        TimelineMarker
    },
    props: {
        region: {
            type: Array,
            required: true
        }
    },
    showBeats: {
        type: Number,
        required: true
    },
    computed: {
        ...mapGetters(['cursorPosition', 'currentTime', 'isPlaying', 'isRecording']),
        markerState () {
            return R.cond([
                [R.equals([true, true]), () => 'recording'],
                [R.equals([true, false]), () => 'playing'],
                [R.equals([false, true]), () => 'awaiting-record'],
                [R.T, () => 'default']
            ])([this.isPlaying, this.isRecording])
        }
    },
    methods: {
        ...mapActions(['setPlaying', 'setCursor']),
        recalculateRegion () {
            // when playing, keep cursor on the center of view
            const [start, end] = this.region
        },
        eventToBeat (e) {
            const {left, right} = this.$el.getBoundingClientRect()
            const relativeX = e.pageX - left
            const [start, end] = this.region
            const width = right - left
            const regionSize = end - start

            const beat = start + (relativeX * regionSize) / width

            const pixelsPerBeat = width / regionSize
            const pixelPerDivision = 20
            let resolution = 0.5
            while (pixelsPerBeat / resolution > pixelPerDivision) {
                resolution *= 2
            }
            return Math.round(beat * resolution) / resolution
        },
        handleMouse (e) {
            this.setCursor(this.eventToBeat(e))
        }
    },
    docEvents: {
        keypress (e) {
            if (e.code === 'Space') {
                this.setPlaying(!this.isPlaying)
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "../core";

.cage {
    position: relative;
}

</style>
