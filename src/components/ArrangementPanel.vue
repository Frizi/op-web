<template lang="html">
  <div layout="column u1">
    <ViewSlider
      :region="region"
      :totalBeats="showBeats"
      :tapes="tapes"
      @updateRegion="updateRegion"
    />
    <BarMarks :region="region" />
    <Tapes
      :region="region"
      :totalBeats="showBeats"
      :tapes="tapes"
      @updateRegion="updateRegion"
    />
  </div>
</template>

<script>
import R from 'ramda'
import {mapGetters, mapActions} from 'vuex'
import Tapes from './Tapes'
import ViewSlider from './ViewSlider'
import BarMarks from './BarMarks'
export default {
  components: {
    Tapes,
    ViewSlider,
    BarMarks
  },
  data () {
    return {
      elWidth: 0,
      caret: 0,
      showBeats: 50
    }
  },
  computed: {
    ...mapGetters(['tapes', 'uiMeasures', 'secondsToBeats']),
    region () {
      const {
        pixelsPerBeat,
        panBeats
      } = this.uiMeasures
      return [panBeats, panBeats + this.elWidth / pixelsPerBeat]
    },
    maxClipRange () {
      const secondsToBeats = this.secondsToBeats
      return R.pipe(
        R.chain(R.prop('clips'), this.tapes),
        R.map(clip => clip.beat + secondsToBeats(clip.duration)),
        R.max
      )
    },
    minBeatsToShow () {
      return Math.ceil(Math.min(this.caret, this.maxClipRange)) + 8
    }
  },
  watch: {
    minBeatsToShow (value) {
      if (value < this.showBeats) {
        this.showBeats = value
      }
    }
  },
  methods: {
    ...mapActions(['updateUiMeasures']),
    gatherMeasures () {
        const rect = this.$el.getBoundingClientRect()
        this.elWidth = rect.right - rect.left
    },
    updateRegion (newRegion) {
      const {
        pixelsPerBeat,
        panBeats
      } = this.uiMeasures
      const newPan = newRegion[0]
      const totalBeats = newRegion[1] - newRegion[0]
      const newPixelsPerBeat = this.elWidth / totalBeats
      this.updateUiMeasures({
        pixelsPerBeat: newPixelsPerBeat,
        panBeats: newPan
      })
    }
  },
  docEvents: {
    resize () {
      this.gatherMeasures()
    }
  },
  mounted () {
    this.gatherMeasures()
  }
}
</script>
