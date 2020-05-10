import React from "react"
import ReactDOM from "react-dom"
import Dragger from "./utils/Dragger";
import Screen from "./components/Screen"
import fscreen from 'fscreen'
import MediaControls from './components/MediaControls'
import { toogleKey } from "./utils/utils";

class App extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            progress: 33,
            showScreen: true,
            fullscreen: false,
            // TODO you can store in range [0, 100] (it will be easy),
            // and convert into [0, 1] range in the actual media component
            volume: 0.5,
            muted: false,
            looped: false,
            currentMediaSrc: '',
            isMediaDrag: false,     // true if a user started dragging media url 
        }
        this.appRef = React.createRef()
    }

    componentDidMount() {
        this.dragger = new Dragger(this.appRef.current, ['.mpl4v-drag-initiator']);
        this.dragger.enable()

        fscreen.addEventListener('fullscreenchange', this.handleFullscreenChange)
        document.addEventListener('dragstart', this.onDragStart)
        document.addEventListener('dragend', this.onDragEnd)
    }

    handleFullscreenChange = event => {
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

    /**
     * 
     * @param {Number} value 
     */
    updateProgress = (value) => {
        this.setState({ progress: value });
    }

    setVolume = newVolume => {
        // newVolume is in range [0, 100]
        // we need it to be in range [0, 1]
        this.setState({ volume: newVolume*0.01 })
    }

    toogleMute = () => this.setState(toogleKey('muted'))
    toogleScreen = () => this.setState(toogleKey('showScreen'))

    toogle = (key) => () => this.setState(toogleKey(key))

    requestFullscreen = () => {
        fscreen.requestFullscreen(this.appRef.current)
    }

    onDragStart = e => {        
        // URL is a special type to get the first valid url
        const url = e.dataTransfer.getData('URL')
        if (!url)   return

        const reg = /\.(3gp|flac|mp3|mp4|webm|ogg|mov)$/i
        if (!url.match(reg)) return
        
        this.setState({ isMediaDrag: true })
    }

    onDragEnter = e => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }
    
    onDragOver = e => {
        e.preventDefault()
    }
    
    onDrop = e => {
        // prevent openening media url
        e.preventDefault()

        const url = e.dataTransfer.getData('URL')
        this.setState({ currentMediaSrc: url })
    }

    onDragEnd = e => this.setState({ isMediaDrag: false })

    render() {
        const { showScreen, fullscreen, progress } = this.state;
        const { volume, muted,  currentMediaSrc } = this.state
        const { looped } = this.state
        const { isMediaDrag } = this.state

        return (
        <div className={ "mpl4v" } ref={ this.appRef }
            style={{ position: "fixed", right: "50px", bottom: "50px" }}
            onDragEnter={ (isMediaDrag || null) && this.onDragEnter }
            onDragOver={ (isMediaDrag || null) && this.onDragOver }
            onDrop={ (isMediaDrag || null) && this.onDrop }
        >
            <Screen 
                showScreen={ showScreen } 
                fullscreen={ fullscreen }
                toogleFullscreen={ fullscreen ? fscreen.exitFullscreen : this.requestFullscreen }
                volume={ volume }
                muted={ muted }
                mediaSrc={ currentMediaSrc }
                looped={ looped }
            />
            <MediaControls 
                progress={ progress }
                fullscreen={ fullscreen }
                onProgressChange={ this.updateProgress }
                showScreen={ showScreen }
                toogleScreen={ fullscreen ? fscreen.exitFullscreen : this.toogleScreen }
                volume={ volume }
                onVolumeChange={ this.setVolume }
                muted={ muted }
                toogleMute={ this.toogleMute }
                looped={ looped }
                toogleLoop={ this.toogle('looped') }
            />
        </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))