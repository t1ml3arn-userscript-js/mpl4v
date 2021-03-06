import { Track } from "./Track"

export default class Playlist {

    constructor(list) {
        this.list = list
    }

    get length() { return this.list.length }

    first = () => this.list[0]
    last = () => this.list[this.length - 1]

    /**
     * Returns track object by given index.
     * Returns `undefined` if the index is our of range
     * @param {number} ind track index in this playlist
     * @returns {Track}
     */
    getTrack(ind) {
        return this.list[ind]
    }

    getNextTrack(currentSrc = null) {
        let nextInd = 0

        if (currentSrc !== null)
            nextInd = this.list.findIndex(x => x.src == currentSrc) + 1
        
        nextInd = nextInd % this.length
        
        return this.list[nextInd]
    }

    getPreventTrack(currentSrc = null) {
        let prevInd = this.length-1

        if (currentSrc !== null)
            prevInd = this.list.findIndex(x => x.src == currentSrc) - 1
        
        if (prevInd == -2)  return null

        prevInd = prevInd < 0 ? this.length - 1 : prevInd

        return this.list[prevInd]
    }

    findTrackIndex(src) { return this.list.findIndex(x => x.src == src) }
}

