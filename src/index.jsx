import React from "react"
import ReactDOM from "react-dom"
import Dragger from "./utils/Dragger";
import Screen from "./components/Screen"
import fscreen from 'fscreen'
import MediaControls from './components/MediaControls'
import { toogleKey, bound } from "./utils/utils";
import drangAndDropMedia from "./components/MediaDragAndDrop";
import VideoEventListener from "./utils/VideoEventListener";

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
            videowidth: 0,
            videoHeight: 0,
            isPlaying: false,
            isBuffering: false,
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
    }

    componentDidMount() {
        this.dragger = new Dragger(this.appRef.current, ['.mpl4v-drag-initiator']);
        this.dragger.enable()

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
    }

    componentDidUpdate(prevProps) {
        // TODO for playing check also autoplay attribute
        if (this.props.droppedMediaURL != prevProps.droppedMediaURL)
            this.requestPlay()
    }

    calcPlaybackProgress = () => {
        const { duration, currentTime } = this.state
        if (!duration) return 0
        
        return bound(currentTime*100/duration, 0, 100)
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

        // this.setState({ isSeeking: true, wasPlaying: !video.paused })
        this.wasPlaying = !video.paused
        
        if (!video.paused) video.pause()

        video.currentTime = progress * 0.01 * (video.duration || 0)
    }
    
    seekEnd = progress => {
        const video = this.mediaRef.current

        // || 0 for case if duration is NaN
        video.currentTime = progress * 0.01 * (video.duration || 0)

        // when seek is ended - play video (if it was playing before)
        if (this.wasPlaying === true) {
            this.requestPlay()
        }
        
        // this.setState({ isSeeking: false, wasPlaying: null })
        this.wasPlaying = null
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
            this.setState({ buffered: 0 })
        } else {
            const buff = video.seekable
            const seekableEnd = buff.end(buff.length - 1)
            const buffered = (seekableEnd / video.duration) * 100
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
            bufferedProgress: 0,
            videowidth: 0,
            videoHeight: 0,
        })
    }

    updateReadyState = e => {
        const elt = e.target
        const net = elt.networkState
        this.setState({ isBuffering: (net == 2 || net == 0) && elt.readyState != 4 })
    }

    render() {
        
        const { showScreen, fullscreen } = this.state
        const { progress, bufferedProgress } = this.state
        const { currentTime, duration } = this.state
        const { volume, muted } = this.state
        const { looped, isPlaying } = this.state

        // drag and drop HOC props
        const { isMediaDrag, isMediaOverDrop } = this.props
        const currentMediaSrc = this.props.droppedMediaURL

        return (
        <div className={ "mpl4v" } ref={ this.appRef }
            style={{ position: "fixed", right: "50px", bottom: "50px" }}
        >
            <Screen 
                showScreen={ showScreen } 
                fullscreen={ fullscreen }
                toogleFullscreen={ fullscreen ? fscreen.exitFullscreen : this.requestFullscreen }
                mediaSrc={ currentMediaSrc }
                looped={ looped }
                mediaRef={ this.mediaRef }
            />
            <MediaControls 
                progress={ progress }
                onSeekStart={ this.seekStart }
                onSeekEnd={ this.seekEnd }
                bufferedProgress={ bufferedProgress }
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
            />
        </div>
        )
    }
}

const MediaDropTarget = drangAndDropMedia(App)

ReactDOM.render(<MediaDropTarget />, document.getElementById("root"))
