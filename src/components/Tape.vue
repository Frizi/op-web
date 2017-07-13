<template lang="html">
    <div class="tape">
        <Clip
            v-for="clip in clipsInRegion"
            :state="active ? 'active': 'defalt'"
            :key="clip.id"
            :clip="clip"
            :region="region"
        />
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Clip from './Clip'
export default {
    components: {
        Clip
    },
    computed: {
        ...mapGetters(['secondsToBeats']),
        clipsInRegion () {
            const secondsToBeats = this.secondsToBeats
            const [startBeat, endBeat] = this.region
            const clipInRegion = clip =>
                clip.beat < endBeat &&
                (clip.beat + secondsToBeats(clip.duration)) > startBeat

            return this.tape.clips.filter(clipInRegion)
        }
    },
    props: {
        tape: {
            type: Object,
            required: true
        },
        region: {
            type: Array,
            required: true
        },
        active: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss">
@import "../core";

.tape {
    height: $unit-x2;
    position: relative;
}
</style>
