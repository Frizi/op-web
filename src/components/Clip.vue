<template lang="html">
    <div class="clip" :style="style" :class="state"></div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: {
        clip: {
            type: Object,
            required: true
        },
        region: {
            type: Array,
            required: true
        },
        state: {
            type: String,
            default: 'default'
        }
    },
    computed: {
        ...mapGetters(['secondsToBeats']),
        style () {
            const [startBeat, endBeat] = this.region
            const regionLength = endBeat - startBeat

            const clip = this.clip
            const offsetBeatStart = clip.beat - startBeat
            const offsetBeatLength = this.secondsToBeats(clip.duration)
            return {
                left: `${(offsetBeatStart / regionLength) * 100}%`,
                width: `${(offsetBeatLength / regionLength) * 100}%`
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "../core";

.clip {
    position: absolute;
    height: 100%;
    background-color: $tape-inactive;
    border-radius: 4px;

    &.active {
        background-color: $tape-active;
    }
}

</style>
