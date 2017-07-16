<template lang="html">
    <div class="settings" layout="row u1">
        <div class="framed">
            <NumberSlider class="tempo"
                :value="tempo" :step="0.1" :min="1" :max="999"
                @update="updateTempo" />
        </div>
        <div class="framed btn" :class="{active: metronomeState !== 'off'}" layout="row center u05" @click="toggleMetronome">
            {{metronomeText}}
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
        <div class="framed beats" layout="row center">
            {{ barsBeatsSixteenths }}
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
import Tone from 'tone'

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
        ...mapGetters(['tempo', 'metre', 'currentTime', 'isPlaying', 'cursorPosition', 'metronomeState']),
        barsBeatsSixteenths () {
            const metre = this.metre
            const tempo = this.tempo
            const timeSignature = Math.round(4 * metre[0] / metre[1])
            const beat = Math.max(0, this.isPlaying ? this.currentTime : this.cursorPosition)
            const measures = beat / timeSignature
            const sixteenths = (beat % 1) * 4;
            const progress = `${Math.floor(measures)}:${Math.floor(beat % timeSignature)}:${Math.floor(sixteenths)}`

            return progress
        },
        metronomeText () {
            switch(this.metronomeState) {
                case 'off':
                case 'on': return '○○';
                case 'left': return '●○';
                case 'right': return '○●';
            }
        }
    },
    methods: {
        ...mapActions(['updateTempo', 'updateMetre', 'toggleMetronome'])
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

.btn {
    cursor: pointer;
    background: $detail;
    color: white;
    &.active {
        color: white;
        background: orange;
    }
}

.beats {
    width: 68px;
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
