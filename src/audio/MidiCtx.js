import webmidi from 'webmidi'
import R from 'ramda'

import drivers from '../drivers'
import store from '../store'

window.webmidi = webmidi

const handleInput = i => {
    const driver = drivers.find(d => d.type === 'input' && d.match(i))
    if (driver) driver.init(i)

    i.addListener('noteon', 'all', (e) => {
        store.dispatch('midiNoteon', {
            inputId:e.target.id,
            noteNumber: e.note.number,
            velocity: e.rawVelocity
        })
    })
    i.addListener('noteoff', 'all', (e) => {
        store.dispatch('midiNoteoff', {
            inputId: e.target.id,
            noteNumber: e.note.number
        })
    })
}

const handleOutput = o => {
    const driver = drivers.find(d => d.type === 'output' && d.match(o))
    if (driver) driver.init(o)
}

const updateStore = () => {
    store.dispatch('midiUpdateDevices', {
        inputs: webmidi.inputs,
        outputs: webmidi.outputs
    })
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
