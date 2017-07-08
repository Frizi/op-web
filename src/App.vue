<template lang="html">
  <div layout="column u1">
    <SettingsPanel />
    <ArrangementPanel />
    <KeyboardController />
  </div>
</template>

<script>
import store from './store'
import SettingsPanel from './components/SettingsPanel'
import ArrangementPanel from './components/ArrangementPanel'
import KeyboardController from './components/KeyboardController'

export default {
  store,
  components: {
    SettingsPanel,
    ArrangementPanel,
    KeyboardController
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

</style>
