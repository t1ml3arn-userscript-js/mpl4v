import { supportedFormats } from "./utils/utils"

/**
 * Base page parser that collects all <video>, <audio> and <a>
 * elements which link to any media
 */
export class PageParser {

    /**
     * @returns {string[]} a list of unique string media URLs
     */
    getMediaURLs() {
        
        let list = this.findElements()
                    .map(item => item.currentSrc || item.src || item.href)
                    // filter out duplicates
                    .reduce((d, item) => {
                        d[item] = 1;
                        return d;
                    }, {})

        list = Object.keys(list)

        return list;
    }

    /**
     * @param {Element} target Where to look
     * @returns {Element[]} array of supported media elements
     */
    findElements(target) {
        const formats = supportedFormats.join('|')
        const formatReg = RegExp(`.(${formats})$`, 'i')

        target = target || document.body
        
        // TODO exclude the player itself from search!
        let list = target.querySelectorAll('video, audio, a[href]')
        list = Array.from(list)
        list = list.filter(item => {
            return item.tagName === 'VIDEO' 
                || item.tagName === 'AUDIO' 
                || formatReg.test(item.href)
        });

        return list;
    }

    /**
     * 
     * @returns {{ src: string, elt: HTMLAnchorElement | HTMLMediaElement }[]}
     */
    getTracks() {
        let uniqs = this.findElements()
                    .map(e => ({
                        src: e.currentSrc || e.src || e.href,
                        elt: e,
                    }))
                    .reduce((obj, item) => {
                        obj[item.src] = item
                        return obj
                    }, {})
        
        return Object.values(uniqs)
    }

    watchPageChanges() {
        // watch page changes and add new tracks to the playlist
    }

    stopWatchPageChanges() {
        // stop watching page changes
    }
}