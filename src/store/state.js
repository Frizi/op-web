export default {
    ui: {
        panBeats: 0,
        pixelsPerBeat: 40
    },
    tempo: 120,
    metre: [4, 4],
    tapes: [{
        id: '4F4F0BC1-9465-4786-8800-A575BB3D911A',
        name: 'Tape 1',
        clips: ['E133493E-6EF6-432D-9E05-5F08DEFD95C1', 'BFB8988D-9C1A-49E4-BDD8-1CE586ED4319']
    }, {
        id: '83658428-AF69-4867-94DC-E74D944313A7',
        name: "Tape 2",
        clips: ['8F3ABBD8-3BC6-4F32-ACDD-2FBC4E4A6133', '61B59978-08C6-4CC0-A118-B3965D156E71']
    }],
    clips: [
        {
            id: 'E133493E-6EF6-432D-9E05-5F08DEFD95C1',
            beat: 0, // start time in beats, float
            duration: 0.5 // duration time in seconds, float
        },
        {
            id: '8F3ABBD8-3BC6-4F32-ACDD-2FBC4E4A6133',
            beat: 1,
            duration: 0.5
        },
        {
            id: 'BFB8988D-9C1A-49E4-BDD8-1CE586ED4319',
            beat: 2,
            duration: 0.5
        },
        {
            id: '61B59978-08C6-4CC0-A118-B3965D156E71',
            beat: 4,
            duration: 0.5
        }
    ],
    midi: {
        inputs: [],
        outputs: []
    }
}
