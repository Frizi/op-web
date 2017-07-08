<template lang="html">
    <div class="marks-bar" :style="{transform}">
        <div class="bar" v-for="bar in bars" :key="bar.value" :style="{left: bar.left}">{{ bar.value }}</div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props: {
        region: {
            type: Array,
            required: true
        },
    },
    computed: {
        ...mapGetters(['beatsPerBar']),
        bars () {
            const barsInView = (this.region[1] - this.region[0]) / this.beatsPerBar
            const min = Math.floor(this.region[0] / this.beatsPerBar)
            const max = Math.ceil(this.region[1] / this.beatsPerBar)
            const bars = []
            for (let i = min; i <= max; i++) {
                bars.push({
                    left: `${100 * i / barsInView}%`,
                    value: i
                })
            }
            return bars

        },
        transform () {
            const offscreenRatio = this.region[0] / (this.region[1] - this.region[0])
            return `translate(${-offscreenRatio * 100}%, 0)`
        }
    }
}
</script>

<style scoped lang="scss">
@import "../core";

.marks-bar {
    height: $unit-x3;
    position: relative;
}

.bar {
    position: absolute;
    bottom: 0;
    height: $unit-x2;
    width: 1px;
    border-left: 1px solid $detail;
    color: white;
    padding-left: 2px;
}
</style>
