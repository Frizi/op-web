import Vue from 'vue'
import App from './App'

import './mixins'
import './store'
import './audio/MidiCtx'

new Vue({
    el: '#app',
    render (h) {
        return h(App)
    }
})
