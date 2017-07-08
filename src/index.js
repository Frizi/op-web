import Vue from 'vue'
import App from './App'

import './mixins'
import './store'
import './audio/MidiCtx'
import './audio/audioCtx'

Vue.prototype.$log = (...args) => console.log(...args)

new Vue({
    el: '#app',
    render (h) {
        return h(App)
    }
})
