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
