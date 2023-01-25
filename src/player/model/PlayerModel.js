import { makeAutoObservable, observable, runInAction } from "mobx";
import Playlist from "./Playlist";
import { clamp } from "../../utils/utils";
import VideoEventListener from "../VideoEventListener";

/**
 * NOTE: `setProp` methods are designed to set state variables 
 * (i.e. update @observables) and sometimes do side effects
 * (like event subscribing or player method calls).
 * NOTE: `updateProp` methods are designed to do only side effects
 * (i.e. call player methods like `play()` or `pause()`)
 * NOTE: `toggleProp` methods are designed to do only side effects
 * NOTE: `togglePropState` are designed to toggle state
 */
export class PlayerModel {

	rateStep = 0.1;
	/** delay between error and playing next track, in ms */
	afterErrorDelay = 4000
	/**
	 * Error delay id to clear the timer if a user requests 
	 * next track before the timer finishes.
	 */
	afterErrorDelayID;

	/** @type {Playlist} */
	playlist;

	/** @type { code: tring, mesage: string } */
	playerError;
	/** @type {HTMLMediaElement} */
	playerElt;
	isBuffering = false;
	/** Buffered data amount in range 0..100 */
	bufferedProgress = 0;
	seekByUser = false;
	duration = 0;
	isPlaying = false;
	currentTime = 0;
	/** Playback progress in range 0..100 */
	playbackProgress = 0;
	playbackRate = 1;
	loop = false;
	hasAudio = true;

	/** 
	 * Indicates play request either by user or by application.
	 * For internal use, NOT @observable
	 */
	playRequest = false;

	/** The media playing right now */
	get track() { return this.playlist?.currentTrack }
	get mediaSrc() { return this.playlist?.currentTrack?.mediaURI }

	/** Internaly volume stores in range 0..100 */
	volume = 50;
	muted = false;

	/** Intended to hold reactions disposers functions
	 * to batch dispose the reactions.
	 * Not observable.
	 * @type {Function[]} */
	disposers = [];

	constructor() {
		makeAutoObservable(this, {
			rateStep: false,
			afterErrorDelay: false,
			afterErrorDelayID: false,
			playerError: observable.ref,
			playerElt: observable.ref,
			togglePause: false,
			toggleMute: false,
			updateVolume: false,
			playRequest: false,
			disposers: false,
		})

		runInAction(() => this.playlist = new Playlist())
	}

	setPlayerElt = (playerElt) => {
		this.playerElt = playerElt;

		// doing side effect right here
		// I could do reaction(), but for what?
		if (playerElt != null) {

			if (process.env.NODE_ENV === 'development')
				this.debugListener = new VideoEventListener(playerElt)

			playerElt.volume = this.volume * 0.01
			playerElt.muted = this.muted
			playerElt.playbackRate = 1

			playerElt.addEventListener('pause', this.setPause);
			playerElt.addEventListener('play', this.setPlay);
			playerElt.addEventListener('play', this.resetPlayRequest);
			playerElt.addEventListener('pause', this.setBufferedProgress);
			playerElt.addEventListener('play', this.setBufferedProgress);
			playerElt.addEventListener('progress', this.setBufferedProgress);
			playerElt.addEventListener('ended', this.playNextOnEnd);
			playerElt.addEventListener('durationchange', this.onDurationChange);
			playerElt.addEventListener('loadstart', this.clearAfterErrorDelay);
			playerElt.addEventListener('loadedmetadata', this.onLoadedMetadata);
			playerElt.addEventListener('timeupdate', this.onTimeUpdate);
			playerElt.addEventListener('volumechange', this.onVolumeChange);

			// abort and emptied events are good candidates 
			// for setting buffered, playbackProgress, duration etc to zero values
			playerElt.addEventListener('abort', this.onAbort);
			playerElt.addEventListener('emptied', this.onAbort);
			// TODO listen "ratechange" to update model when rate
			// was changed outside

			playerElt.addEventListener('canplay', this.checkHasAudio);
			playerElt.addEventListener('play', this.webkitCheckHasAudio);

			playerElt.addEventListener("error", this.onPlayerError)
			playerElt.addEventListener('canplay', this.resetError);
			playerElt.addEventListener('canplay', this.playIfRequested);

			// list of events on which you will update buffering state
			['canplay', 'canplaythrough', 'loadstart', 'stalled', 'suspend',
				'seeking', 'seeked', 'loadedmetadata', 'playing', 'waiting',
				'error',
			].forEach(event => playerElt.addEventListener(event, this.setIsBuffering))
		} else {
			this.disposers.forEach(func => func())
			this.disposers = []
			// TODO also removeEventListeners
		}
	}

	setPause = () => this.isPlaying = false
	setPlay = () => this.isPlaying = true

	resetPlayRequest = () => this.playRequest = false

	togglePause = () => {
		// NOTE method is not action, it does only side effects
		const v = this.playerElt
		if (v.paused || v.ended) {
			clearTimeout(this.afterErrorDelayID)
			this.play()
		}
		else
			v.pause()
	}

	setLoop = loop => this.loop = Boolean(loop)

	toggleLoopState = () => this.loop = !this.loop

	setBufferedProgress = e => {
		const video = e.target

		if (!video.duration) {
			this.bufferedProgress = 0
		} else {
			const buff = video.buffered;
			const buffEnd = buff.end(buff.length - 1);
			const buffered = (buffEnd / video.duration) * 100;
			this.bufferedProgress = buffered
		}
	}

	playNextOnEnd = () => {
		// NOTE assume that `ended` fired only when
		// media really ended.
		// NOTE before `ended` a `pause` is fired.
		// NOTE in Firefox if `loop` is `true` then 
		// `ended` is NOT fired (other browsers not checked).

		// do not change track if user do seek with progress bar
		if (this.seekByUser)
			return;

		let index = this.playlist.currentTrackIndex + 1
		if (index === this.playlist.length) {
			this.isPlaying = false
			return
		}

		// At this moment <video> is can be in pause
		// and I need to re-set isPlaying again
		this.isPlaying = true
		this.playNext()
	}

	onDurationChange = e => this.duration = e.target.duration || 0;

	clearAfterErrorDelay = () => clearTimeout(this.afterErrorDelayID)

	onLoadedMetadata = e => {
		// In some mobile browsers, when loadedmetadata is raised 
		// (if it even is raised) — video.duration may not have 
		// the correct value, or even any value at all,
		// See more here https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player#Progress
		this.duration = e.target.duration || 0
	}

	onTimeUpdate = e => {
		const time = e.target.currentTime;
		const duration = e.target.duration;

		this.currentTime = time
		this.playbackProgress = clamp(time * 100 / duration, 0, 100)
	}

	setPlaybackProgress = val => this.playbackProgress = clamp(val, 0, 100);

	onVolumeChange = e => {
		this.volume = clamp(e.target.volume * 100, 0, 100)
		this.muted = e.target.muted
	}

	// NOTE method is not action, it does only side effects
	toggleMute = () => this.playerElt.muted = !this.playerElt.muted

	/**
	 * Sets volume of media element
	 * NOTE method is not action, it does only side effects (sets volume),
	 * state update happens when 'volumechange' event fires
	 * @param {number} v new volume value in range 0..100
	 */
	updateVolume = v => this.playerElt.volume = clamp(v, 0, 100) * 0.01

	onAbort = () => {
		this.duration = 0
		this.currentTime = 0
		this.playbackProgress = 0
		this.bufferedProgress = 0
		// NOTE from old way, dont know if I need this
		// this.isPlaying = false
	}

	checkHasAudio = e => {
		const video = e.target;
		// The way to know if a video has an audio
		// See more https://stackoverflow.com/questions/30604696/use-javascript-to-detect-if-an-mp4-video-has-a-sound-track
		if (video.webkitAudioDecodedByteCount !== undefined)
			this.hasAudio = video.webkitAudioDecodedByteCount > 0
		else
			this.hasAudio = video?.mozHasAudio || true
	}

	webkitCheckHasAudio = e => {
		const video = e.target;

		if (video.webkitAudioDecodedByteCount !== undefined) {
			this.hasAudio = video.webkitAudioDecodedByteCount > 0
		}
	}

	increaseSpeed = () => this.setPlaybackRate(clamp(this.playerElt.playbackRate + this.rateStep, 0.1, 4.0))
	decreaseSpeed = () => this.setPlaybackRate(clamp(this.playerElt.playbackRate - this.rateStep, 0.1, 4.0))

	setPlaybackRate = rate => this.playerElt.playbackRate = this.playbackRate = Math.round(rate * 100) / 100

	onPlayerError = (e) => {
		const { code, message } = e.target.error;
		const userMessage = getMediaErrorMessage(e.target.error);
		console.error(`Media error ${code}: ${message}. ${userMessage}`);

		this.playerError = { code: message, message: userMessage }

		// Wait a bit and play next media 
		if (this.isPlaying)
			this.afterErrorDelayID = setTimeout(this.playNext, this.afterErrorDelay)
	}

	resetError = () => this.playerError = null;

	setIsBuffering = e => {
		const elt = e.target;
		const net = elt.networkState;

		this.isBuffering = (net == 2 || net == 0) && elt.readyState != 4;
	}

	playNext = () => {
		clearTimeout(this.afterErrorDelayID)
		this.playlist.setNextTrack()
		this.playRequest = true
	}

	playPrevent = () => {
		clearTimeout(this.afterErrorDelayID)
		this.playlist.setPreventTrack()
		this.playRequest = true
	}

	playIfRequested = () => {
		if (this.playRequest) {
			this.playRequest = false
			this.playerElt.play()
		}
	}

	play = () => {
		// NOTE when [src] is set on <video> it stops playing.
		// But `play()` might not work since it is too soon.
		// So request flag is set and when `canplay` event fires
		// the actual playing starts
		this.playRequest = true
		// this.isPlaying = true
		if (this.playerElt.readyState > 2)
			this.playerElt.play()
	}

	startSeek = progress => {
		this.seekByUser = true;
		this.playbackProgress = clamp(progress, 0, 100)

		this.wasPlaying = !this.playerElt.paused

		if (!this.playerElt.paused) this.playerElt.pause()

		this.playerElt.currentTime = this.lerpTime()
		// this.playerElt.fastSeek(this.playbackProgress * 0.01 * duration)

		// TODO for performanse reason while seeking `currentTime` should be update
		// not often, so I need a trick for this
		// this.seekStopWatcher.enable();
		// TODO update current time while seeking,
		// right now current time updates only on seek start/end .
	}

	endSeek = progress => {
		this.seekByUser = false
		this.playbackProgress = clamp(progress, 0, 100)

		this.playerElt.currentTime = this.lerpTime()

		if (this.wasPlaying === true) this.playerElt.play()

		this.wasPlaying = null
	}

	lerpTime() {
		// `duration || 0` for the case if duration is NaN 
		// (e.g. this might be in between "load start" and "canplay" events)
		const duration = this.playerElt.duration || 0

		return this.playbackProgress * 0.01 * duration
		// this.playerElt.fastSeek(this.playbackProgress * 0.01 * duration)
	}
}

/**
 * Returns readable message from given error object
 * @param {MediaError} err MediaError object
 */
function getMediaErrorMessage(err) {
	switch (err.code) {
		case 1: return "Aborted by user"
		case 2: return "Network error"
		case 3: return "Cannot decode"
		case 4: return "Source is not suitable"
		default: return `Unknown error code "${err.code}"`
	}
}