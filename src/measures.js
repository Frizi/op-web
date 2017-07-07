export const beatsPerBar = (metre) => {
    return 4 * metre[0] / metre[1]
}

export const barsPerMinute = (tempo, metre) => {
    return tempo / beatsPerBar(metre)
}

export const secondsPerBar = (tempo, metre) => {
    return 60 * beatsPerBar(metre) / tempo
}

export const secondsPerBeat = (tempo) => {
    return 60 / tempo
}

export const secondsToBeats = (seconds, tempo) => {
    return seconds * tempo / 60
}
