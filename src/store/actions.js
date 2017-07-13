import R from 'ramda'

const getName = id => R.pipe(
    R.find(R.propEq('id', id)),
    R.prop('name')
)

export const midiUpdateDevices = ({commit, state}, {inputs, outputs}) => {
    const oldIns = state.midi.inputs.filter(i => i.virtual === false)
    const oldOuts = state.midi.outputs.filter(i => i.virtual === false)
    const inputIds = R.pluck('id', inputs)
    const outputIds = R.pluck('id', outputs)

    const addedIns = R.difference(inputIds, oldIns)
    const removedIns = R.difference(oldIns, inputIds)
    const addedOuts = R.difference(outputIds, oldOuts)
    const removedOuts = R.difference(oldOuts, outputIds)

    removedIns.forEach(id => commit('MIDI_DISCONNECT_INPUT', {id}))
    removedOuts.forEach(id => commit('MIDI_DISCONNECT_OUTPUT', {id}))

    addedIns.forEach(id => commit('MIDI_CONNECT_INPUT', {
        id,
        name: getName(id)(inputs),
        virtual: false
    }))

    addedOuts.forEach(id => commit('MIDI_CONNECT_OUTPUT', {
        id,
        name: getName(id)(outputs),
        virtual: false
    }))
}

export const midiConnectVirtualInput = ({commit, state}, {id, name}) => {
    commit('MIDI_CONNECT_INPUT', {id, name, virtual: true})
}

export const midiDisconnectVirtualInput = ({commit, state}, {id}) => {
    if (state.midi.inputs.find(i => i.id === id && i.virtual === true)) {
        commit('MIDI_DISCONNECT_INPUT', {id})
    }
}

export const updateUiMeasures = ({commit}, newMeasures) => {
    commit('UPDATE_UI_MEASURES', newMeasures)
}

export const updateTempo = ({commit}, tempo) => {
    commit('UPDATE_TEMPO', tempo)
}

export const updateMetre = ({commit}, metre) => {
    commit('UPDATE_METRE', metre)
}

export const midiNoteon = ({commit, dispatch, getters}, {inputId, noteNumber, velocity}) => {
    if (getters.armRecording) {
        dispatch('setPlaying', true)
    }
    commit('MIDI_NOTE_SET', {inputId, noteNumber, velocity})
}

export const midiNoteoff = ({commit}, {inputId, noteNumber}) => {
    commit('MIDI_NOTE_END', {inputId, noteNumber})
}

export const setRecording = ({commit, state}, armRecording) => {
    if (state.armRecording !== armRecording) {
        commit('SET_RECORDING', {
            armRecording,
            playing: state.playing,
            currentTime: state.currentTime
        })
    }
}

export const setPlaying = ({commit, state}, playing) => {
    if(state.playing !== playing) {
            commit('SET_PLAYING', {
                playing,
                armRecording: state.armRecording,
                currentTime: state.ui.cursorPosition
            })
    }
}

export const setCursor = ({commit}, pos) => {
    commit('SET_CURSOR', pos)
}

export const setActiveTape = ({commit}, id) => {
    commit('SET_ACTIVE_TAPE', id)
}

export const createClip = ({commit, state}, clip) => {
    commit('NEW_CLIP', {clip})
    commit('ADD_CLIP_TO_TAPE', {tapeId: state.activeTape, clipId: clip.id})

}
