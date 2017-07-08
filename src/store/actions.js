import {types} from './mutations'
import R from 'ramda'

const getName = id => R.pipe(
    R.find(R.propEq('id', id)),
    R.prop('name')
)

export const midiUpdateDevices = ({commit, state}, {inputs, outputs}) => {
    const oldIns = state.midi.inputs.filter(i => i.virtual === false)
    const oldOuts = state.midi.outputs.filter(i => i.virtual === false)

    const addedIns = R.difference(inputs, oldIns)
    const removedIns = R.difference(oldIns, inputs)
    const addedOuts = R.difference(outputs, oldOuts)
    const removedOuts = R.difference(oldOuts, outputs)

    removedIns.forEach(id => commit(types.MIDI_DISCONNECT_INPUT, {id}))
    removedOuts.forEach(id => commit(types.MIDI_DISCONNECT_OUTPUT, {id}))

    addedIns.forEach(id => commit(types.MIDI_CONNECT_INPUT, {
        id,
        name: getName(id)(inputs),
        virtual: false
    }))

    addedOuts.forEach(id => commit(types.MIDI_CONNECT_OUTPUT, {
        id,
        name: getName(id)(inputs),
        virtual: false
    }))
}

export const midiConnectVirtualInput = ({commit, state}, {id, name}) => {
    commit(types.MIDI_CONNECT_INPUT, {id, name, virtual: true})
}

export const midiDisconnectVirtualInput = ({commit, state}, {id}) => {
    if (state.midi.inputs.find(i => i.id === id && i.virtual === true)) {
        commit(types.MIDI_DISCONNECT_INPUT, {id})
    }
}

export const updateUiMeasures = ({commit}, newMeasures) => {
    commit(types.UPDATE_UI_MEASURES, newMeasures)
}

export const updateTempo = ({commit}, tempo) => {
    commit(types.UPDATE_TEMPO, tempo)
}

export const updateMetre = ({commit}, metre) => {
    commit(types.UPDATE_METRE, metre)
}

export const midiNoteon = ({commit}, {inputId, noteNumber, velocity}) => {
    commit(types.MIDI_NOTE_SET, {inputId, noteNumber, velocity})
}

export const midiNoteoff = ({commit}, {inputId, noteNumber}) => {
    commit(types.MIDI_NOTE_END, {inputId, noteNumber})
}
