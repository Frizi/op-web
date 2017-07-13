export default {
    ui: {
        panBeats: 0,
        pixelsPerBeat: 40,
        cursorPosition: 0,
        selectedTape: null
    },
    tempo: 120,
    metre: [4, 4],
    armRecording: false,
    recordingStartBeat: null,
    activeTape: '4F4F0BC1-9465-4786-8800-A575BB3D911A',
    playing: false,
    currentTime: 0,
    tapes: [{
        id: '4F4F0BC1-9465-4786-8800-A575BB3D911A',
        name: 'Tape 1',
        clips: []
    }, {
        id: '83658428-AF69-4867-94DC-E74D944313A7',
        name: "Tape 2",
        clips: []
    }, {
        id: '73C638A8-E00B-4028-B4D2-A48A56A4C750',
        name: "Tape 2",
        clips: []
    }, {
        id: '7601E7F4-C47E-4455-81B9-E62A3769F11E',
        name: "Tape 2",
        clips: []
    }],
    clips: [],
    midi: {
        inputs: [],
        outputs: []
    }
}
