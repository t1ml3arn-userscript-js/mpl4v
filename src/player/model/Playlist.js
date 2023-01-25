import { action, makeAutoObservable, observable } from "mobx";
import { Track } from "./Track"

export default class Playlist {

    /** @type {Track[]} */
    list;

    get length() { return this.list.length }

    /** @type {Track} */
    _currentTrack = null;

    get currentTrack() { return this._currentTrack }
    
    /** @type {number} */
    _currentTrackIndex = 0;

    get currentTrackIndex() { return this._currentTrackIndex }

    constructor(list = []) {
        makeAutoObservable(this, {
            // NOTE in the future I might want to remove .ref
            // to be able to observe changes of the list.
            list: observable.shallow,
            setPlaylist: action,
            setNextTrack: action,
            setPreventTrack: action,
            setTrackAsCurrent: action,
            getTrack: false,
            findTrackIndex: false,
            first: false,
            last: false,
        })

        this.setPlaylist(list)
    }

    /**
     * 
     * @param {Track[]} list 
     */
    setPlaylist = list => {
        this.list = list
        this._currentTrackIndex = 0
        this._currentTrack = list[0]
    }; 

    first = () => this.list[0]
    last = () => this.list[this.length - 1]

    /**
     * Returns track object by given index.
     * Returns `undefined` if the index is out of range
     * @param {number} ind track index in this playlist
     * @returns {Track}
     */
    getTrack(ind) {
        return this.list[ind]
    }

    findTrackIndex(url) { return this.list.findIndex(x => x.mediaURI === url) }

    setNextTrack = () => {
        this._currentTrackIndex = (this._currentTrackIndex + 1) % this.length
        this._currentTrack = this.list[this._currentTrackIndex]
    }

    setPreventTrack = () => {
        this._currentTrackIndex = (this._currentTrackIndex - 1) % this.length
        this._currentTrackIndex = (this.currentTrackIndex + this.length) % this.length

        this._currentTrack = this.list[this._currentTrackIndex]
    }

    setTrackAsCurrent = (track, index) => {
        this._currentTrack = track
        this._currentTrackIndex = index
    }
}

