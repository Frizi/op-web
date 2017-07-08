<template lang="html">
    <div class="settings" layout="row u1">
        <div class="framed">
            <NumberSlider class="tempo"
                :value="tempo" :step="0.1" :min="0" :max="999"
                @update="updateTempo" />
        </div>
        <div class="framed" layout="row center u05">
            <NumberSlider class="metre"
                :value="metre[0]" :min="1" :max="16"
                @update="updateMetre([$event, metre[1]])" />
            <span>/</span>
            <NumberSlider class="metre"
                :value="metre[1]":step="2" :min="2" :max="16"
                @update="updateMetre([metre[0], $event])" />
        </div>
        <div class="framed">
            <RecordingSwitch />
        </div>
    </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import NumberSlider from './NumberSlider'
import RecordingSwitch from './RecordingSwitch'

export default {
    components: {
        NumberSlider,
        RecordingSwitch
    },
    data () {
        return {
            elWidth: 0,
            caret: 0,
            showBeats: 50
        }
    },
    computed: {
        ...mapGetters(['tempo', 'metre'])
    },
    methods: {
        ...mapActions(['updateTempo', 'updateMetre'])
    }
}
</script>

<style scoped lang="scss">
@import "../core";

.framed {
    border: 1px solid $detail;
    color: $detail;
    font-size: $unit-x2;
    text-align: center;
    padding: 0 $unit-half;
    border-radius: $unit-half;
}

.tempo {
    width: $unit-x6;
}

.metre {
    width: $unit-x3;
}

.settings {
    padding: $unit $unit-x2;
}

</style>
