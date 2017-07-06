export const types = {
    MIDI_CONNECT_INPUT: 'MIDI_CONNECT_INPUT',
    MIDI_DISCONNECT_INPUT: 'MIDI_DISCONNECT_INPUT',
    MIDI_CONNECT_OUTPUT: 'MIDI_CONNECT_OUTPUT',
    MIDI_DISCONNECT_OUTPUT: 'MIDI_DISCONNECT_OUTPUT'
}

export const MIDI_CONNECT_INPUT = (state, {id}) => {
    state.midi.inputs.push(id)
}

export const MIDI_CONNECT_OUTPUT = (state, {id}) => {
    state.midi.outputs.push(id)
}

export const MIDI_DISCONNECT_INPUT = (state, {id}) => {
    const index = state.midi.inputs.indexOf(id)
    if (index >= 0) state.midi.inputs.splice(index, 1)
}

export const MIDI_DISCONNECT_OUTPUT = (state, {id}) => {
    const index = state.midi.outputs.indexOf(id)
    if (index >= 0) state.midi.outputs.splice(index, 1)
}
