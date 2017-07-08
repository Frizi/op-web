<template lang="html">
  <div
    layout="column u1"
    @wheel.prevent.stop="handleWheel"
  >
    <Tape
      v-for="(tape, index) in tapes"
      :key="tape.id"
      :tape="tape"
      :region="region"
    />
  </div>
</template>

<script>
import Tape from './Tape'
export default {
  components: {
    Tape
  },
  props: {
    tapes: {
      type: Array,
      required: true
    },
    region: {
      type: Array,
      required: true
    },
    totalBeats: {
      type: Number,
      required: true
    }
  },
  methods: {
    handleWheel (e) {
      const bounds = this.$el.getBoundingClientRect()
      const elWidth = bounds.right - bounds.left

      const [regionStart, regionEnd] = this.region
      const regionLen = regionEnd - regionStart

      const moveX = e.deltaX * regionLen / elWidth

      const newStart = Math.max(0, Math.min(this.totalBeats - regionLen, regionStart + moveX))

      this.$emit('updateRegion', [newStart, newStart + regionLen])
    }
  }
}
</script>

<style scoped lang="scss">
@import "../core";

</style>
