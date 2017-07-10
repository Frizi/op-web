import R from 'ramda'

import {
    secondsToBeats as rawSecondsToBeats,
    beatsPerBar as rawBeatsPerBar
} from '../measures'

export const tapes = (state) => {
    const clips = state.clips
    return R.map(
        R.evolve({
            clips: R.map(
                R.pipe(
                    R.propEq('id'),
                    R.find(R.__, state.clips)
                )
            )
        }),
        state.tapes
    )
}

export const uiMeasures = (state) => {
    const {
        pixelsPerBeat,
        panBeats
    } = state.ui

    return {
        pixelsPerBeat,
        panBeats
    }
}

export const secondsToBeats = state => {
    const metre = state.metre
    const tempo = state.tempo
    return seconds => rawSecondsToBeats(seconds, tempo, metre)
}

export const beatsPerBar = state => rawBeatsPerBar(state.metre)

export const metre = state => state.metre
export const tempo = state => state.tempo

export const allActiveNotes = state => {
    return R.pipe(
        R.chain(R.prop('notes')),
        R.groupBy(R.prop('number')),
        R.map(R.reduce(R.maxBy(R.prop('velocity')), {velocity: -1})),
        R.values,
        R.sortBy(R.prop('number'))
    )(state.midi.inputs)
}

export const isRecording = state => state.playback.recording

export const cursorPosition = state => state.ui.cursorPosition
export const playbackData = state => state.playback
export const playTimestamp = state => state.playback.playTimestamp
