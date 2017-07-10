import store from '../store'
import R from 'ramda'
export default {
    type: 'output',
    match (e) {
        return e.name.indexOf('Launchpad') >= 0
    },
    init (e) {
        e.sendControlChange(0, 0)
        e.sendControlChange(0, 2)
        this.input = e

        store.watch((_, g) => g.allActiveNotes, (notes, oldNotes) => {
            const newIds = R.pluck('number', notes || [])
            const oldIds = R.pluck('number', oldNotes || [])
            const startNotes = R.difference(newIds, oldIds)
            const endNotes = R.difference(oldIds, newIds)

            startNotes.forEach(number => e.playNote(number, 1, {velocity: 1}))
            endNotes.forEach(number => e.stopNote(number, 1))

        }, {immediate: true})
    }
}
