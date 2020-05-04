import React from "react"
import ReactDOM from "react-dom"
import Progress from "./components/Progress";
import TimeLabel from "./components/TimeLabel";
import Dragger from "./utils/Dragger";
import ScreenButton from "./components/ScreenButton";

class App extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            progress: 33,
            showScreen: false,
        }
        this.appRef = React.createRef()
    }

    componentDidMount() {
        this.dragger = new Dragger(this.appRef.current, ['.mpl4v-drag-initiator']);
        this.dragger.enable()
    }

    /**
     * 
     * @param {Number} value 
     */
    updateProgress = (value) => {
        this.setState({ progress: value });
    }

    showScreen = (e) => {
        this.setState((prevState) => {
            return { showScreen: !prevState.showScreen }
        })
    }

    render() {
        const { showScreen } = this.state;

        return (
        <div className={ "mpl4v" } ref={ this.appRef }
            style={{ position: "fixed", right: "50px", bottom: "50px" }}
        >
            <div class={`mpl4v-screen ${showScreen ? '' : 'mpl4v--hidden'}`}>
                {/* <!-- here will be the screen --> */}
            </div>
            <div class="mpl4v-controls">
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
                                toogleScreen={this.showScreen}
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