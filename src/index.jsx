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
        }
        this.appRef = React.createRef()
    }

    componentDidMount() {
        this.dragger = new Dragger(this.appRef.current, ['.mpl4v-drag-initiator']);
        this.dragger.enable()

        fscreen.addEventListener('fullscreenchange', this.handleFullscreenChange)
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

    toogleMute = () => {
        this.setState(toogleKey('muted'))
    }

    toogleScreen = (e) => {
        this.setState(toogleKey('showScreen'))
    }

    requestFullscreen = () => {
        fscreen.requestFullscreen(this.appRef.current)
    }

    render() {
        const { showScreen, fullscreen, progress } = this.state;
        const { volume, muted } = this.state

        return (
        <div className={ "mpl4v" } ref={ this.appRef }
            style={{ position: "fixed", right: "50px", bottom: "50px" }}
        >
            <Screen 
                showScreen={ showScreen } 
                fullscreen={ fullscreen }
                toogleFullscreen={ fullscreen ? fscreen.exitFullscreen : this.requestFullscreen }
                volume={ volume }
                muted={ muted }
                mediaSrc={ "./rabbit320.mp4" }
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
            />
        </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))