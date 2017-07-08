import webmidi from 'webmidi'
import R from 'ramda'

import drivers from '../drivers'
import store from '../store'

window.webmidi = webmidi

const handleInput = i => {
  const driver = drivers.find(d => d.type === 'input' && d.match(i))
  if (driver) driver.init(i)

  i.addListener('')
}

const handleOutput = o => {
  const driver = drivers.find(d => d.type === 'output' && d.match(o))
  if (driver) driver.init(o)
}

const updateStore = () => {
  const outputs = webmidi.outputs.map(R.prop('id'))
  const inputs = webmidi.inputs.map(R.prop('id'))
  store.dispatch('midiUpdateDevices', {inputs, outputs})
}

webmidi.enable(() => {
  webmidi.outputs.forEach(handleOutput)
  webmidi.inputs.forEach(handleInput)
  updateStore()

  webmidi.addListener('connected', (e) => {
    if (e.input) handleInput(e.input)
    if (e.output) handleOutput(e.output)
    updateStore()
  })
  webmidi.addListener('disconnected', (e) => {
    updateStore()
  })
})

export default {
  getOutput: (id) => webmidi.outputs.find(o => o.id === id),
  getInput: (id) => webmidi.inputs.find(i => i.id === id)
}
