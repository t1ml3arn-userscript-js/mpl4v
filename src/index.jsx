import React from "react"
import ReactDOM from "react-dom"
import Progress from "./components/Progress";
import TimeLabel from "./components/TimeLabel";
import Dragger from "./utils/Dragger";
import ScreenButton from "./components/ScreenButton";
import Screen from "./components/Screen"
import fscreen from 'fscreen'

const toogleKey = key => state => {
    return {[key]: !state[key]}
}

class App extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            progress: 33,
            showScreen: true,
            fullscreen: false,
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

    toogleScreen = (e) => {
        this.setState(toogleKey('showScreen'))
    }

    requestFullscreen = () => {
        fscreen.requestFullscreen(this.appRef.current)
    }

    render() {
        const { showScreen, fullscreen } = this.state;

        return (
        <div className={ "mpl4v" } ref={ this.appRef }
            style={{ position: "fixed", right: "50px", bottom: "50px" }}
        >
            <Screen 
                showScreen={ showScreen } 
                requestFullscreen={ this.requestFullscreen }
                fullscreen={ fullscreen }
            />
            <div class="mpl4v-controls" data-fullscreen={ fullscreen }>
                <Progress progress={ this.state.progress } onProgressChange={ this.updateProgress }/>
                    <div class="mpl4v-control-btns mpl4v-drag-initiator">
                        <div class="mpl4v-fl-row mpl4-controls--left ">
                            <i class="zmdi zmdi-repeat"></i>
                            <i class="zmdi zmdi-skip-previous"></i>
                            <i class="zmdi zmdi-play"></i>
                            <i class="zmdi zmdi-skip-next"></i>
                            <i class="zmdi zmdi-shuffle"></i>
                        </div>
                        <TimeLabel time={12345} duration={44444}/>
                        <div class="mpl4v-fl-row mpl4-controls--right">
                            <i class="zmdi zmdi-volume-up mpl4v-vol-ctrl"></i>
                            <ScreenButton 
                                showScreen={this.state.showScreen}
                                toogleScreen={this.toogleScreen}
                            />
                            <i class="zmdi zmdi-download"></i>
                        </div>
                    </div>
            </div>
        </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))