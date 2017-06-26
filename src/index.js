import Vue from 'vue'
import App from './App'

import './mixins'

new Vue({
    el: '#app',
    render (h) {
        return h(App)
    }
})
