
export default class VideoEventListener {
    constructor(video) {
        this.video = video

        video.addEventListener('abort', this.printData)
        video.addEventListener('canplay', this.printData)
        video.addEventListener('canplaythrough', this.printData)
        video.addEventListener('complete', this.printData)
        video.addEventListener('durationchange', this.printData)
        video.addEventListener('emptied', this.printData)
        video.addEventListener('ended', this.printData)
        video.addEventListener('error', this.printData)
        video.addEventListener('loadeddata', this.printData)
        video.addEventListener('loadedmetadata', this.printData)
        video.addEventListener('loadstart', this.printData)
        video.addEventListener('pause', this.printData)
        video.addEventListener('play', this.printData)
        video.addEventListener('playing', this.printData)
        video.addEventListener('progress', this.printData)
        video.addEventListener('ratechange', this.printData)
        video.addEventListener('seekend', this.printData)
        video.addEventListener('seeking', this.printData)
        video.addEventListener('stalled', this.printData)
        video.addEventListener('suspend', this.printData)
        video.addEventListener('timeupdate', this.printData)
        video.addEventListener('volumechange', this.printData)
        video.addEventListener('waiting', this.printData)
    }

    printData = (e) => {
        const elt = e.target

        const data = {
            type: e.type,
            buffered: this.formatRange(elt.buffered),
            seekable: this.formatRange(elt.seekable),
            currentTime: elt.currentTime,
            duration: elt.duration,
            videoWidth: elt.videoWidth,
            videoHeight: elt.videoHeight,
            volume: elt.volume,
            muted: elt.muted,
            readyState: elt.readyState,
            error: elt.error,
            networkState: elt.networkState,
            width: elt.width,
            height: elt.height,
            played: this.formatRange(elt.played),
        }
        console.log(data)
    }

    copy(from) {
        return Object.assign({}, from)
    }

    formatRange(range) {
        let result = ''
        for (let i = 0; i < range.length; i++) {
            result += `[${range.start(i)}-${range.end(i)}] `
        }
        return result
    }
}