import { Track } from "./Track"

export default class Playlist {

    constructor(list) {
        this.list = list
    }

    getNextTrack(currentSrc = null) {
        let nextInd = 0

        if (currentSrc !== null)
            nextInd = this.list.findIndex(x => x.src == currentSrc) + 1
        
        nextInd = nextInd % this.list.length
        
        return this.list[nextInd]
    }

    getPreventTrack(currentSrc = null) {
        let prevInd = this.list.length-1

        if (currentSrc !== null)
            prevInd = this.list.findIndex(x => x.src == currentSrc) - 1
        
        if (prevInd == -2)  return null

        prevInd = prevInd < 0 ? this.list.length - 1 : prevInd

        return this.list[prevInd]
    }

    getTrack(src) {
        return this.list.find(x => x.src == src) || new Track(src)
    }
}

