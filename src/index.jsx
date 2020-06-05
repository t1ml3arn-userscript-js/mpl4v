import css from "./css/mpl4v.css"
import React from "react"
import ReactDOM from "react-dom"
import Dragger from "./utils/Dragger";
import Screen from "./components/Screen"
import fscreen from 'fscreen'
import MediaControls from './components/MediaControls'
import { toogleKey, bound } from "./utils/utils";
import drangAndDropMedia from "./components/MediaDragAndDrop";
import VideoEventListener from "./utils/VideoEventListener";
import MouseStopWatcher from './utils/MouseStopWatcher'
import { PageParser } from "./PageParser";
import { Track } from "./media/Track";
import MediaError from "./media/MediaError";

class App extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            progress: 0,
            bufferedProgress: 0,
            showScreen: true,
            fullscreen: false,
            volume: 50,
            muted: false,
            looped: false,
            duration: 0,
            currentTime: 0,
            videoWidth: 0,
            videoHeight: 0,
            isPlaying: false,
            isBuffering: false,
            seekByUser: false,
            track: {},
            trackIndex: 0,
            autoplay: false,
            hasAudio: true,
            error: null,
            hideControls: false,
        }
        // since I wrapped this, I have to use given ref instead the new one
        this.appRef = props.dropTargetRef || React.createRef()
        this.mediaRef = React.createRef()
        
        // list of events on which you will update spinner
        this.bufferEvents = [
            'canplay', 'canplaythrough', 'loadstart', 'stalled', 'suspend',
            'seeking', 'seeked', 'loadedmetadata', 'playing', 'waiting',
            'error',
        ]

        this.wasPlaying = null
        this.pageParser = new PageParser()
        this.playlist = this.pageParser.buildPlaylist()

        // delay between error and playing next track, in ms
        this.errorDelay = 3000
        // error delay id to clear the timer if a user requests 
        // next track before the timer finishes
        this.errorDelayID = undefined

        this.fscreenStop = new MouseStopWatcher(2500, this.setHideControls, this.setShowControls)
    }

    componentDidMount() {
        const playerElt = this.appRef.current
        this.dragger = new Dragger(playerElt, ['.mpl4v-drag-initiator'], playerElt)
        this.dragger.enable()
        
        // Passing to setState() empty object and callback.
        // In the callback I do actual update of current time,
        // since at that moment I can read real state.progress value                
        this.seekStopWatcher = new MouseStopWatcher(200, () => this.setState({}, this.setCurrentTime))

        fscreen.addEventListener('fullscreenchange', this.handleFullscreenChange)
        
        const video = this.mediaRef.current
        video.addEventListener('pause', this.setPause)
        video.addEventListener('pause', this.updateBufferedProgress)
        video.addEventListener('play', this.setPlay)
        video.addEventListener('play', this.updateBufferedProgress)
        video.addEventListener('ended', this.onPlayEnded)
        video.addEventListener('durationchange', this.onDurationChange)
        video.addEventListener('loadedmetadata', this.onLoadedMeta)
        video.addEventListener('timeupdate', this.onTimeUpdate)
        video.addEventListener('volumechange', this.onVolumeChange)
        video.addEventListener('progress', this.updateBufferedProgress)
        // abort and emptied events are good candidates 
        // for setting buffered, progress, duration etc to zero values
        video.addEventListener('abort', this.onAbort)
        video.addEventListener('emptied', this.onAbort)
        video.addEventListener('error', this.onPlayError)
        video.addEventListener('canplay', this.resetError)
        video.addEventListener('canplay', this.checkHasAudio)
        video.addEventListener('play', this.webkitCheckHasAudio)
        // do "side-effect": derrive real volume from initial state 
        video.volume = this.state.volume * 0.01

        this.bufferEvents.forEach(e => video.addEventListener(e, this.updateReadyState));

        this.listener = new VideoEventListener(video)

        // next track or empty object if there is no next track
        this.setState(this.getNewTrackState(0))
    }

    setCurrentTime = () => {
        const video = this.mediaRef.current
        video.currentTime = this.state.progress * 0.01 * (video.duration || 0)
    }

    componentDidUpdate(prevProps, prevState) {
        const {droppedMediaURL} = this.props
        if (droppedMediaURL && (droppedMediaURL != prevProps.droppedMediaURL)) {

            const track = this.state.track
            if (track.src === droppedMediaURL)
                return

            const requestPlay = (this.state.isPlaying || this.state.autoplay) ? this.requestPlay : undefined
            const index = this.playlist.findTrackIndex(droppedMediaURL)
            
            if (index != -1)
                this.setState(this.getNewTrackState(index), requestPlay)
            else {
                const nextIndex = this.state.trackIndex + 1
                this.setState({ track: new Track(droppedMediaURL), trackIndex: nextIndex}, requestPlay)
            }
        }

        // Unmute if new volume value is different
        const prevVolume = prevState.volume
        const { volume } = this.state
        if (volume != prevVolume)
            this.mediaRef.current.muted = false
        // -------------------------------------
    }

    setPlay = () => this.setState({ isPlaying: true })
    setPause = () => this.setState({ isPlaying: false })

    handleFullscreenChange = () => {
        // if it is fullscreen and it is OUR fulslcreen
        if (fscreen.fullscreenElement) {
            if (fscreen.fullscreenElement == this.appRef.current) {
                this.dragger.disable()
                this.fscreenStop.enable()

                this.setState({ 
                    fullscreen: true,
                    hideControls: true,
                })
            }
        } else {
            this.setState(state => {
                // we disable fullscreen state only if 
                // it was previously requested from us
                if (state.fullscreen) {
                    this.dragger.enable()
                    this.fscreenStop.disable()

                    return { 
                        fullscreen: false,
                        hideControls: false,
                    }
                }
            })
        }
    }
    
    setVolume = value => this.mediaRef.current.volume = value * 0.01
    setProgress = value => this.setState({ progress: value })

    seekStart = progress => {
        // This method is called when 
        // user starts seeking with progres bar

        // pause video if it was playing
        const video = this.mediaRef.current

        this.setState({ seekByUser: true })
        this.wasPlaying = !video.paused
        
        if (!video.paused) video.pause()

        video.currentTime = progress * 0.01 * (video.duration || 0)

        this.seekStopWatcher.enable()
    }
    
    seekEnd = progress => {
        const video = this.mediaRef.current

        // || 0 for case if duration is NaN
        video.currentTime = progress * 0.01 * (video.duration || 0)

        // when seek is ended - play video (if it was playing before)
        if (this.wasPlaying === true) {
            this.requestPlay()
        }
        
        this.setState({ seekByUser: false })
        this.wasPlaying = null
        this.seekStopWatcher.disable()
    }

    toogleMute = () => {
        const video = this.mediaRef.current
        video.muted = !video.muted 
    }

    toogleScreen = () => this.setState(toogleKey('showScreen'))
    toogleLoop = () => this.setState(toogleKey('looped'))

    requestFullscreen = () => {
        this.dragger.stopDrag()        
        fscreen.requestFullscreen(this.appRef.current)
    }

    playpause = () => {
        const video = this.mediaRef.current
        if (video.paused || video.ended)
            this.requestPlay()
        else
            video.pause()
    }

    requestPlay = () => {
        clearTimeout(this.errorDelayID)
        this.mediaRef.current.play()
    }

    onPlayError = e => {
        const { code, message } = e.target.error
        const userMessage = MediaError.getMessage(e.target.error)
        console.error(`Media error ${code}: ${message}. ${userMessage}`)

        this.setState({ error: {code: message, message: userMessage } })

        // Wait 3 sec and play next media 
        this.errorDelayID = setTimeout(this.playNext, this.errorDelay);
    }

    onDurationChange = e => this.setState({duration: e.target.duration})

    updateBufferedProgress = e => {
        const video = e.target

        if (!video.duration) {
            this.setState({ bufferedProgress: 0 })
        } else {
            const buff = video.buffered
            const buffEnd = buff.end(buff.length - 1)
            const buffered = (buffEnd / video.duration) * 100
            this.setState({ bufferedProgress: buffered})
        }
    }

    onLoadedMeta = e => {
        const video = e.target

        // in some mobile browsers, when loadedmetadata is raised 
        // if it even is raised — video.duration 
        // may not have the correct value, or even any value at all
        // from here https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player#Progress
        this.setState({ duration: video.duration || 0})
    }

    onTimeUpdate = e => {
        const time = e.target.currentTime
        const duration = e.target.duration
        this.setState({ 
            currentTime: time,
            progress:  bound(time*100/duration, 0, 100)
        })
    }

    onVolumeChange = e => {
        this.setState({ 
            volume: bound(e.target.volume * 100, 0, 100),
            muted: e.target.muted
        })
    }

    onAbort = e => {
        this.setState({
            duration: 0,
            currentTime: 0,
            progress: 0,
            bufferedProgress: 0,
            videoWidth: 0,
            videoHeight: 0,
            isPlaying: false,
        })
    }

    updateReadyState = e => {
        const elt = e.target
        const net = elt.networkState
        this.setState({ isBuffering: (net == 2 || net == 0) && elt.readyState != 4 })
    }

    onPlayEnded = e => {
        this.setState({ isPlaying: false })

        const nextTrack = this.state.trackIndex + 1
        const isLast = nextTrack == this.playlist.length
        // if this track is the last - do nothing
        // otherwise get next one and play it
        if (!isLast) {
            this.setState(this.getNewTrackState(nextTrack), this.requestPlay)
        }
    }

    playNext = () => {
        clearTimeout(this.errorDelayID)

        const isPlaying = this.state.isPlaying
        let index = this.state.trackIndex + 1            
        index = index % this.playlist.length

        this.setState(this.getNewTrackState(index), isPlaying ? this.requestPlay : undefined)
    }
    
    playPrevent = () => {
        clearTimeout(this.errorDelayID)

        const isPlaying = this.state.isPlaying
        let index = this.state.trackIndex - 1
        const len = this.playlist.length
        index = (len + index) % len

        this.setState(this.getNewTrackState(index), isPlaying ? this.requestPlay : undefined)
    }

    getNewTrackState = index => ({ track: this.playlist.getTrack(index) || {}, trackIndex: index })

    resetError = () => this.setState({ error: null })

    checkHasAudio = e => {
        const video = e.target
        // The way to know if a video has an audio
        // See more https://stackoverflow.com/questions/30604696/use-javascript-to-detect-if-an-mp4-video-has-a-sound-track
        if (video.webkitAudioDecodedByteCount !== undefined)
            this.setState({ hasAudio:  video.webkitAudioDecodedByteCount > 0 })
        else if (video.mozHasAudio !== undefined)
            this.setState({ hasAudio: video.mozHasAudio })
        else
            this.setState({ hasAudio: true })
    }

    webkitCheckHasAudio = e => {
        const video = e.target
        
        if (video.webkitAudioDecodedByteCount !== undefined) {
            this.setState({ hasAudio: video.webkitAudioDecodedByteCount > 0 })
        }
    }

    setHideControls = () => this.setState({ hideControls: true })
    setShowControls = () => this.setState(this.getShowControlsState)

    /** Returns state "show controls" bun only if it was hidden previously */
    getShowControlsState(state) {
        if (state.hideControls)
            return { hideControls: false }
    }

    render() {
        
        const { showScreen, fullscreen, hideControls } = this.state
        const { progress, bufferedProgress } = this.state
        const { currentTime, duration } = this.state
        const { volume, muted, hasAudio } = this.state
        const { looped, isPlaying, seekByUser } = this.state

        // drag and drop HOC props
        const { isMediaDrag, isMediaOverDrop } = this.props
        const { track } = this.state

        return (
        <div className={ "mpl4v" } ref={ this.appRef }
            style={{ position: "fixed", right: "50px", bottom: "50px" }}
        >
            <Screen
                showScreen={ showScreen } 
                fullscreen={ fullscreen }
                toogleFullscreen={ fullscreen ? fscreen.exitFullscreen : this.requestFullscreen }
                mediaSrc={ track.src }
                looped={ looped }
                mediaRef={ this.mediaRef }
                videoEltRef={ this.mediaRef }
                title={ track.title }
                error={ this.state.error }
                hideScreenHUD={ hideControls }
                hudFocusIn={ this.fscreenStop.disable }
                hudFocusOut={ this.fscreenStop.enable }
            />
            <MediaControls 
                progress={ progress }
                onSeekStart={ this.seekStart }
                onSeekEnd={ this.seekEnd }
                seekByUser={ seekByUser }
                bufferedProgress={ bufferedProgress }
                canChangeTime={ Boolean(duration) }
                duration={ duration }
                currentTime={ currentTime }
                fullscreen={ fullscreen }
                onProgressChange={ this.setProgress }
                showScreen={ showScreen }
                toogleScreen={ fullscreen ? fscreen.exitFullscreen : this.toogleScreen }
                volume={ volume }
                onVolumeChange={ this.setVolume }
                muted={ muted }
                toogleMute={ this.toogleMute }
                looped={ looped }
                toogleLoop={ this.toogleLoop }
                tooglePlayPause={ this.playpause }
                isPlaying={ isPlaying }
                isBuffering={ this.state.isBuffering }
                downloadURL={ track.src }
                saveAs={ track.title }
                playNext={ this.playNext }
                playPrevent={ this.playPrevent }
                hasAudio={ hasAudio }
                hideControls={ hideControls }
                focusIn={ this.fscreenStop.disable }
                focusOut={ this.fscreenStop.enable }
            />
        </div>
        )
    }
}

// append player's css
const style = document.createElement('style');
style.textContent = css;
document.head.append(style);

// append material design iconic font
// NOTE it must be added AFTER player's css
const fontStyle = document.createElement('link')
fontStyle.rel = "stylesheet"
fontStyle.href = "https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css"
document.head.append(fontStyle)

// player will be added to its special container
// since React.render() wipes render target children
const container = document.body.appendChild(document.createElement('div'))
container.classList.add('mpl4v-container')

const MediaDropTarget = drangAndDropMedia(App)
ReactDOM.render(<MediaDropTarget />, container)