import R from 'ramda'
import {isDef} from '../util'

import {
    secondsToBeats as rawSecondsToBeats,
    beatsPerBar as rawBeatsPerBar
} from '../measures'

export const recordingDuration = (state, getters) => {
    if (!getters.isRecording) return 0
    const numBeats = state.currentTime - state.recordingStartBeat
    return 60 * numBeats / state.tempo
}

export const clips = (state, getters) => {
    const realClips = state.clips
    if (getters.isRecording) {
        return [...realClips, {
            id: '<RECORDING>',
            beat: state.recordingStartBeat,
            duration: getters.recordingDuration
        }]
    }
    return realClips
}

export const normalizedTapes = (state, getters) => {
    const realTapes = state.tapes
    if (getters.isRecording) {
        return R.map(
            R.ifElse(
                R.propEq('id', state.activeTape),
                R.evolve({clips: R.append('<RECORDING>')}),
                R.identity
            )
        )(realTapes)
    }
    return realTapes
}

export const tapes = (state, getters) => {
    const clips = getters.clips
    return R.map(
        R.evolve({
            clips: R.map(
                R.pipe(
                    R.propEq('id'),
                    R.find(R.__, clips)
                )
            )
        }),
        getters.normalizedTapes
    )
}

export const activeTapeId = state => state.activeTape

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

export const armRecording = state => state.armRecording
export const isPlaying = state => state.playing
export const isRecording = (state) => state.playing && state.armRecording
export const metronomeState = (state, getters) => {
    if (!state.metronome) {
        return 'off'
    } else if (!getters.isPlaying) {
        return 'on'
    } else {
        return Math.floor(state.currentTime) % 2
            ? 'right'
            : 'left'
    }
}

export const cursorPosition = state => state.ui.cursorPosition
export const currentTime = state => state.currentTime

import Tone from 'tone'

export const cursorTickTime = state => {
    return Math.round(state.ui.cursorPosition * Tone.Transport.PPQ)
}
