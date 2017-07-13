<template lang="html">
    <label layout="row u1 center" :class="{recording: armRecording}">
        <input
            type="checkbox"
            :checked="armRecording"
            @change="setRecording($event.target.checked)"
        />
        <span class="message">
            <span v-for="part in labelParts">{{part}}</span>
        </span>
    </label>
</template>

<script>
import R from 'ramda'

const labels = [
    [200, '|RED| MEANS RECORDING'],
    [15, '|RED| MEANS KNOBBING'],
    [15, 'WHAT DOES |RED| MEANS?'],
    [25, '|RED| MEANS ACCEPTABLE'],
    [15, '|RED| MEANS |S|I|Z|Z|L|E'],
    [2, '|REGGIE| MEANS RECORDING'],
    [10, '|BED| MEANS BEATCORDING'],
    [10, '|RED| MEANS WHATEVER'],
    [5, 'PLINK|ORDING|'],
    [20, '|BREAD| BEANS RECORING'],
]

const totalWeights = R.pipe(
    R.pluck(0),
    R.reduce(R.add, 0)
)(labels)

const selectLabel = R.reduce((acc, pair) => {
    const newAcc = acc - pair[0]
    return newAcc <= 0 ? R.reduced(pair[1]) : newAcc
}, R.__, labels)

import {mapGetters, mapActions} from 'vuex'
export default {
    computed: {
        ...mapGetters(['armRecording']),
        labelParts () {
            return this.label.split('|')
        }
    },
    methods: {
        ...mapActions(['setRecording'])
    },
    data () {
        return {
            label: 'RED MEANS RECORDING'
        }
    },
    watch: {
        armRecording (rec) {
            if (rec) {
                this.label = selectLabel(Math.random() * totalWeights)
            } else {
                this.label = 'RED MEANS RECORDING'
            }
        }
    },
    docEvents: {
        keypress (e) {
            if (e.code === 'KeyR') {
                this.setRecording(!this.armRecording)
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "../core";

label {
    height: $unit-x3;
    color: $detail-lighter;
}

.recording {
    color: white;
    font-weight: bold;
}

.message > span:nth-child(2n) {
    color: $theme-4;
}
</style>
