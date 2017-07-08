<template lang="html">
    <div layout="column u1">
        <SettingsPanel />
        <ArrangementPanel />
        <KeyboardController />
        <audio></audio>
        <label>
            <input
                type="checkbox"
                :checked="isRecording"
                @change="setRecording($event.target.checked)"
            />
            <span :class="{recording: isRecording}">RED MEANS RECORDING</span>
        </label>
    </div>
</template>

<script>
import store from './store'
import SettingsPanel from './components/SettingsPanel'
import ArrangementPanel from './components/ArrangementPanel'
import KeyboardController from './components/KeyboardController'
import {mapGetters, mapActions} from 'vuex'

export default {
    store,
    components: {
        SettingsPanel,
        ArrangementPanel,
        KeyboardController
    },
    computed: {
        ...mapGetters(['isRecording'])
    },
    methods: {
        ...mapActions(['setRecording'])
    },
    docEvents: {
        keypress (e) {
            if (e.code === 'KeyR') {
                this.setRecording(!this.isRecording)
            }
        }
    }
}
</script>

<style lang="scss">

@import "./core";
@import "./layout";

html, body {
    margin: 0;
    width: 100%;
    height: 100%;
    font-size: 9px;
    font-family: Arial, sans-serif;
    background: black;
    overflow: hidden;
}

label span {
    color: white;
}

.recording {
    color: red;
}
</style>
