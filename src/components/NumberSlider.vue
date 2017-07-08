<template lang="html">
  <div v-if="!editing" @click="startEdit" class="value" @wheel.prevent.stop="handleWheel">{{formattedValue}}</div>
  <form v-else @submit.prevent.stop="applyEdit">
    <input
      @keydown.stop
      @keyup.stop
      v-focus
      @blur="cancelEdit"
      class="input"
      v-model="internalValue"
    />
  </form>
</template>

<script>
import R from 'ramda'
export default {
  props: {
    value: {
      required: true,
      type: Number
    },
    step: {
      type: Number,
      default: 1
    },
    sensitivity: {
      type: Number,
      default: 10
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      editing: false,
      internalValue: 0,
      accumulator: 0
    }
  },
  computed: {
    numDecimals () {
      return (this.step.toString().split('.')[1] || '').length;
    },
    formattedValue () {
      return this.value.toFixed(this.numDecimals)
    }
  },
  methods: {
    handleWheel(e) {
      this.accumulator += e.deltaY
      const scale = 10
      const scaledValue = this.accumulator / this.sensitivity
      const valueChange = scaledValue > 0 ? Math.floor(scaledValue) : Math.ceil(scaledValue)
      if (valueChange !== 0) {
        this.accumulator -= Math.round(valueChange * this.sensitivity)
        const newVal = Math.round((this.value / this.step) + valueChange) * this.step
        const boundVal = Math.max(this.min, Math.min(this.max, newVal))
        this.$emit('update', boundVal)
      }
    },

    applyEdit () {
      this.editing = false
      const newVal = Math.round(parseFloat(this.internalValue) / this.step) * this.step
      const boundVal = Math.max(this.min, Math.min(this.max, newVal))
      this.$emit('update', boundVal)
    },

    startEdit () {
      this.editing = true
      this.internalValue = this.formattedValue
    },

    cancelEdit () {
      this.editing = false
    }
  }
}
</script>

<style scoped lang="scss">
@import "../core";


.value, input {
  color: $theme-3;
  border: none;
  background: none;
  height: $unit-x3;
  line-height: $unit-x3;
  font-size: $unit-x2;
  color: white;
  text-align: center;
}

.value {
  cursor: row-resize;
}
input {
  background: $detail;
  margin: 0;
  padding: 0;
  width: 100%;
  height: $unit-x2;
  line-height: $unit-x2;
  display: block;
  outline: none;
}

form {
  color: $theme-3;
  margin: 0;
  padding: $unit-half 0;
  display: block;
}
</style>
