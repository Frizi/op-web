import Vue from 'vue'

Vue.mixin({
  beforeCreate () {
    const evs = this.$options.docEvents
    if (evs) {
      this._boundDocEvents = []
      for (const eventName in evs) {
        const bound = evs[eventName].bind(this)
        this._boundDocEvents.push([eventName, bound])
        document.addEventListener(eventName, bound, false)
      }
    }
  },
  desroyed () {
    if (this._boundDocEvents) {
      this._boundDocEvents.forEach(([eventName, bound]) => {
        document.removeEventListener(eventName, bound, false)
      })
    }
  }
})
