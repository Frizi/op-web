<template lang="html">
    <div layout="column u1">
        <Tape v-for="tape in tapes" :tape="tape" :region="region"/>
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
        }
    }
}
</script>

<style scoped lang="scss">
@import "../core";

</style>
