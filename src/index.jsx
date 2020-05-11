import React from "react"
import ReactDOM from "react-dom"
import Dragger from "./utils/Dragger";
import Screen from "./components/Screen"
import fscreen from 'fscreen'
import MediaControls from './components/MediaControls'
import { toogleKey } from "./utils/utils";
import drangAndDropMedia from "./components/MediaDragAndDrop";

class App extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            progress: 33,
            showScreen: true,
            fullscreen: false,
            volume: 50,
            muted: false,
            looped: false,
        }
        // since I wrapped this, I have to use given ref instead the new one
        this.appRef = props.dropTargetRef || React.createRef()
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

    setVolume = value => this.setState({ volume: value })

    toogleMute = () => this.setState(toogleKey('muted'))
    toogleScreen = () => this.setState(toogleKey('showScreen'))

    toogle = (key) => () => this.setState(toogleKey(key))

    requestFullscreen = () => {
        fscreen.requestFullscreen(this.appRef.current)
    }

    render() {

        */
        const { showScreen, fullscreen, progress } = this.state;
        const { volume, muted } = this.state
        const { looped } = this.state

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

const MediaDropTarget = drangAndDropMedia(App)

ReactDOM.render(<MediaDropTarget />, document.getElementById("root"))
