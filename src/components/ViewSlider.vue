<template lang="html">
    <div
        class="viewSlider"
        @wheel.prevent.stop="handleWheel"
        @mousedown.prevent.stop="handleDown"
        layout="column"
    >
        <div class="tape" v-for="tape in tapes">
            <div class="clip" v-for="clip in tape.clips" :style="clipStyle(clip)"></div>
        </div>
        <div class="window" :style="windowStyle"/>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Tape from './Tape'
export default {
    components: {
        Tape
    },
    props: {
        totalBeats: {
            type: Number,
            required: true
        },
        region: {
            type: Array,
            required: true
        },
        tapes: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters(['secondsToBeats']),
        windowStyle () {
            const start = this.region[0]
            const length = this.region[1] - start
            return {
                left: `${100 * start / this.totalBeats}%`,
                width: `${100 * length / this.totalBeats}%`
            }
        }
    },
    mounted () {
        this._dragLast = null
    },
    docEvents: {
        mouseup (e) {
            if (this._dragLast !== null) {
                e.preventDefault()
                this.handleUp(e)
            }
        },
        mousemove (e) {
            if (this._dragLast !== null) {
                e.preventDefault()
                this.handleDrag(e)
            }
        }
    },
    methods: {
        handleDown (e) {
            this._dragLast = e.pageX
        },
        handleUp (e) {
            this._dragLast = null
        },
        handleDrag (e) {
            const delta = e.pageX - this._dragLast
            this._dragLast = e.pageX

            const bounds = this.$el.getBoundingClientRect()
            const elWidth = bounds.right - bounds.left
            const moveX = delta * this.totalBeats / elWidth

            const width = this.region[1] - this.region[0]
            const start = Math.min(
                this.totalBeats - width,
                Math.max(0, this.region[0] + moveX)
            )

            this.$emit('update', [start, start + width])
        },
        handleWheel (e) {
            const bounds = this.$el.getBoundingClientRect()
            const elWidth = bounds.right - bounds.left

            const moveX = -e.deltaX * this.totalBeats / elWidth

            const adjDeltaY = e.deltaY > 0 ? Math.max(0, e.deltaY - 2) : Math.min(0, e.deltaY + 2)
            const zoomY = Math.pow(1.05, adjDeltaY)
            const regionStart = this.region[0]
            const regionEnd = this.region[1]

            const regionMid = (regionStart + regionEnd) / 2
            const regionLen = regionEnd - regionStart

            const newLen = Math.min(Math.max(1, regionLen * zoomY), this.totalBeats)
            const lenShift = regionLen - newLen

            const newStart = Math.min(
                this.totalBeats - newLen,
                Math.max(0, regionStart + moveX + lenShift / 2)
            )

            this.$emit('update', [newStart, newStart + newLen])
        },
        clipStyle (clip) {
            const total = this.totalBeats
            const beatStart = clip.beat
            const beatWidth = this.secondsToBeats(clip.duration)
            return {
                left: `${100 * beatStart / total}%`,
                width: `${100 * beatWidth / total}%`
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "../core";

.viewSlider {
    position: relative;
    padding: $unit-half 0;
    border-bottom: 1px solid $detail;
}

.window {
    position: absolute;
    top: 0;
    bottom: 0;
    box-shadow: 0 0 5px 1px white;
}

.tape {
    height: $unit-half;
}

.clip {
    position: absolute;
    top: 1px;
    bottom: 1px;
    background: $tape-active;
}
</style>
