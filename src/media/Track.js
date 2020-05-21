import { reverseString } from "../utils/utils";

const fnameEreg = /(^.+?)(\/|$)/i;

export class Track {
    
    uid = null;
    src = null;
    _title = null;
    tagTitle = null;

    constructor(src, title) {
        this.src = src;
        this._title = title;
    }

    get title() {
        if (!this._title) {
            const reversed = reverseString(this.src);
            const match = reversed.match(fnameEreg);
            if (match) {
                const rname = match[1];
                const ind = rname.indexOf('.');
                this._title = reverseString(rname.slice(ind + 1));
            }
            else {
                console.log('Cannot extract file name from source', this.src);
                this._title = this.src;
            }
        }
        return this._title;
    }

    getTagTitle() {
        return this.getTitle();
    }
}
