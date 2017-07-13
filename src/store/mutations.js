import Vue from 'vue'

export const MIDI_CONNECT_INPUT = (state, {id, name, virtual}) => {
    state.midi.inputs.push({
        id,
        name,
        virtual,
        notes: []
    })
}

export const MIDI_CONNECT_OUTPUT = (state, {id, name, virtual}) => {
    state.midi.outputs.push({
        id,
        name,
        virtual
    })
}

export const MIDI_DISCONNECT_INPUT = (state, {id}) => {
    const index = state.midi.inputs.findIndex(i => i.id === id)
    if (index >= 0) state.midi.inputs.splice(index, 1)
}

export const MIDI_DISCONNECT_OUTPUT = (state, {id}) => {
    const index = state.midi.outputs.findIndex(o => o.id === id)
    if (index >= 0) state.midi.outputs.splice(index, 1)
}

export const MIDI_NOTE_SET = (state, {inputId, noteNumber, velocity}) => {
    const input = state.midi.inputs.find(input => input.id === inputId)
    if (input) {
        const existingNote = input.notes.find(note => note.number === noteNumber)
        if (existingNote) {
            existingNote.velocity = velocity
        }
        else {
            input.notes.push({
                number: noteNumber,
                velocity
            })
        }
    }
}

export const MIDI_NOTE_END = (state, {inputId, channel, noteNumber}) => {
    const input = state.midi.inputs.find(input => input.id === inputId)
    if (input) {
        const index = input.notes.findIndex(note => note.number === noteNumber)
        if (index >= 0) input.notes.splice(index, 1)
    }
}

export const UPDATE_UI_MEASURES = (state, {pixelsPerBeat, panBeats}) => {
    state.ui.pixelsPerBeat = pixelsPerBeat
    state.ui.panBeats = panBeats
}

export const UPDATE_TEMPO = (state, tempo) => {
    state.tempo = tempo
}

export const UPDATE_METRE = (state, metre) => {
    Vue.set(state.metre, 0, metre[0])
    Vue.set(state.metre, 1, metre[1])
}

export const SET_RECORDING = (state, {playing, armRecording, currentTime}) => {
    state.armRecording = armRecording
    if (playing && armRecording) {
        state.recordingStartBeat = currentTime
    }
}

export const SET_PLAYING = (state, {playing, armRecording, currentTime}) => {
    state.playing = playing
    if (playing && armRecording) {
        state.recordingStartBeat = currentTime
    }
    if (!playing) {
        state.armRecording = false
    }
}

export const SET_TIME = (state, time) => {
    state.currentTime = time
}

export const SET_CURSOR = (state, pos) => {
    state.ui.cursorPosition = pos
}

export const SET_ACTIVE_TAPE = (state, id) => {
    state.activeTape = id
}

export const NEW_CLIP = (state, {clip}) => {
    state.clips.push(clip)
}

export const ADD_CLIP_TO_TAPE = (state, {tapeId, clipId}) => {
    const tape = state.tapes.find(t => t.id === tapeId)
    if (tape) {
        tape.clips.push(clipId)
    }
}
