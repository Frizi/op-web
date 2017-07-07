import {expect} from 'chai'
import {
    secondsPerBeat,
    secondsToBeats
} from '../src/measures'

describe('secondsPerBeat', () => {
    it('calculates correctly', () => {
        expect(secondsPerBeat(120)).to.be.equal(0.5)
        expect(secondsPerBeat(60)).to.be.equal(1)
    })
})

describe('secondsToBeats', () => {
    it('works for 120', () => {
        expect(secondsToBeats(0.5, 120)).to.be.equal(1)
        expect(secondsToBeats(2, 120)).to.be.equal(4)
        expect(secondsToBeats(1, 60)).to.be.equal(1)
    })
})
