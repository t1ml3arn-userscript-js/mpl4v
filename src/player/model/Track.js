import { reverseString } from "../../utils/utils";

const fnameEreg = /(^.+?)(\/|$)/i;

export class Track {

    /** @type {HTMLAnchorElement | HTMLMediaElement} */
    elt;

    /** @type {string | null} */
    mediaURI = null;
    /** @type {string | null} */
    #title = null;

    constructor(mediaURI, elt) {
        this.mediaURI = mediaURI;
        this.elt = elt
    }

    get title() {
        if (!this.#title) {
            // NOTE (\\|\/|^)[-\w.%а-я]+$ for not reversed string
            // https://regex101.com/r/vX39BX/1
            const reversed = reverseString(this.mediaURI);
            const match = reversed.match(fnameEreg);
            if (match) {
                const rname = match[1];
                const ind = rname.indexOf('.');
                this.#title = reverseString(rname.slice(ind + 1));
            }
            else {
                console.log('Cannot extract file name from source', this.mediaURI);
                this.#title = this.mediaURI;
            }
        }
        return this.#title;
    }
}
