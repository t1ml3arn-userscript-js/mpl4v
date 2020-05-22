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
    }

    componentDidMount() {
        this.dragger = new Dragger(this.appRef.current, ['.mpl4v-drag-initiator']);
        this.dragger.enable()

        this.mouseStopWatcher = new MouseStopWatcher(0.4, () => {
            const video = this.mediaRef.current
            this.setState({}, () => {
                // Passing empty object and callback.
                // In the callback I do actual update of current time,
                // since at that moment I can read real state.progress value                
                video.currentTime = this.state.progress * 0.01 * (video.duration || 0)
            })
        })

        fscreen.addEventListener('fullscreenchange', this.handleFullscreenChange)
        
        const video = this.mediaRef.current
        video.onended = () => this.setState({ isPlaying: false })
        video.onpause = () => this.setState({ isPlaying: false })
        video.onplay = () => this.setState({ isPlaying: true })
        video.addEventListener('durationchange', this.onDurationChange)
        video.addEventListener('loadedmetadata', this.onLoadedMeta)
        video.addEventListener('timeupdate', this.onTimeUpdate)
        video.addEventListener('volumechange', this.onVolumeChange)
        video.addEventListener('progress', this.onLoadingProgress)
        // abort and emptied events are good candidates 
        // for setting buffered, progress, duration etc to zero values
        video.addEventListener('abort', this.onAbort)
        video.addEventListener('emptied', this.onAbort)

        this.bufferEvents.forEach(e => video.addEventListener(e, this.updateReadyState));

        this.listener = new VideoEventListener(video)

        // next track or empty object if there is no next track
        this.setState(this.getNewTrackState(0))
    }

    componentDidUpdate(prevProps) {
        if (this.props.droppedMediaURL != prevProps.droppedMediaURL)
        if (this.state.autoplay)
            this.requestPlay()
    }

    handleFullscreenChange = () => {
        // if it is fullscreen and it is OUR fulslcreen
        if (fscreen.fullscreenElement) {
            if (fscreen.fullscreenElement == this.appRef.current) {
                // dragger must be disabled in fullscreen mode
                this.dragger.disable()
                this.setState({ fullscreen: true })
            }
        } else {
            this.setState(state => {
                // we update our fullscreen state only if 
                // it was requested from us
                if (state.fullscreen) {
                    this.dragger.enable()
                    return { fullscreen: false }
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

        this.mouseStopWatcher.enable()
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
        this.mouseStopWatcher.disable()
    }

    toogleMute = () => {
        const video = this.mediaRef.current
        video.muted = !video.muted 
    }

    toogleScreen = () => this.setState(toogleKey('showScreen'))
    toogleLoop = () => this.setState(toogleKey('looped'))

    requestFullscreen = () => {
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
        this.mediaRef.current.play()
            .catch(this.onPlayError)
    }

    onPlayError = e => {
        console.log('error when tried to play', e)
    }

    onDurationChange = e => this.setState({duration: e.target.duration})

    onLoadingProgress = e => {
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

    playNext = () => {
        const isPlaying = this.state.isPlaying
        let index = this.state.trackIndex + 1            
        index = index % this.playlist.length
        
        this.setState(this.getNewTrackState(index), isPlaying ? this.requestPlay : undefined)
    }
    
    playPrevent = () => {
        const isPlaying = this.state.isPlaying
        let index = this.state.trackIndex - 1
        const len = this.playlist.length
        index = (len + index) % len

        this.setState(this.getNewTrackState(index), isPlaying ? this.requestPlay : undefined)
    }

    getNewTrackState = index => ({ track: this.playlist.getTrack(index) || {}, trackIndex: index })

    render() {
        
        const { showScreen, fullscreen } = this.state
        const { progress, bufferedProgress } = this.state
        const { currentTime, duration } = this.state
        const { volume, muted } = this.state
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