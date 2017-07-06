import {types} from './mutations'
import R from 'ramda'

export const midiUpdateDevices = ({commit, state}, {inputs, outputs}) => {
    const oldIns = state.midi.inputs
    const oldOuts = state.midi.outputs

    const addedIns = R.difference(inputs, oldIns)
    const removedIns = R.difference(oldIns, inputs)
    const addedOuts = R.difference(outputs, oldOuts)
    const removedOuts = R.difference(oldOuts, outputs)

    removedIns.forEach(id => commit(types.MIDI_DISCONNECT_INPUT, {id}))
    removedOuts.forEach(id => commit(types.MIDI_DISCONNECT_OUTPUT, {id}))

    addedIns.forEach(id => commit(types.MIDI_CONNECT_INPUT, {id}))
    addedOuts.forEach(id => commit(types.MIDI_CONNECT_OUTPUT, {id}))
}
