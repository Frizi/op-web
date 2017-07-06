export default {
    type: 'output',
    match (e) {
        return e.name.indexOf('Launchpad') >= 0
    },
    init (e) {
        e.sendControlChange(0, 0)
        e.sendControlChange(0, 2)
        this.input = e

        return {

        }
    }
}
