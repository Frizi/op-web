<template lang="html">
    <div :class="`marker ${state}`" :style="style"/>
</template>

<script>
export default {
    props: {
        state: {
            type: String,
            default: 'default'
        },
        region: {
            type: Array,
            required: true
        },
        position: {
            type: Number,
            required: true
        }
    },
    computed: {
        style () {
            const pos = 100 * (this.position - this.region[0]) / (this.region[1] - this.region[0])
            return {
                transform: `translateX(${pos}%)`
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "../core";

.marker {
    &.default { color: $theme-1; }
    &.playing { color: $theme-2; }
    &.awaiting-record { color: $theme-4; }
    &.recording { color: $theme-4; }

    width: 100%;
    border-left: 1px solid currentColor;
    box-sizing: border-box;
    pointer-events: none;;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;

    &:before {
        content: '';
        top: 0;
        position: absolute;
        left: -4px;
        border: ($unit-half - 0.5) solid transparent;
        border-top-color: currentColor;
        border-bottom-width: 0;
        border-top-width: $unit * 0.66;
    }
}
</style>
