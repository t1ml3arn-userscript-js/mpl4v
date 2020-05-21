import { supportedFormats } from "./utils/utils"
import { Track } from "./media/Track";
import Playlist from "./media/Playlist";

/**
 * Base page parser that collects all <video>, <audio> and <a>
 * elements which link to any media
 */
export class PageParser {

    buildPlaylist() {
        const formats = supportedFormats.join('|')
        const formatReg = RegExp(`.(${formats})$`, 'i')

        let list = document.body.querySelectorAll('video[src], audio[src], a[href]')
        list = Array.from(list)
        list = list.filter(e => {
            return e.tagName === 'VIDEO' 
                || e.tagName === 'AUDIO' 
                || formatReg.test(e.href)
        })

        return new Playlist(list.map(elt => new Track(elt.href || elt.src)))
    }

    /**
     * Return track title, parsed from given `track` html element
     * @param {Element} elt an element that represents media track
     */
    getTrackTitle(elt) {
        return null
    }

    watchPageChanges() {
        // watch page changes and add new tracks to the playlist
    }

    stopWatchPageChanges() {
        // stop watching page changes
    }
}