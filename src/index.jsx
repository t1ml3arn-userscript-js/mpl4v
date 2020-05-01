import React from "react"
import ReactDOM from "react-dom"
import Progress from "./components/Progress";
import TimeLabel from "./components/TimeLabel";

class App extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            progress: 33,
        }
    }

    /**
     * 
     * @param {Number} value 
     */
    updateProgress = (value) => {
        this.setState({ progress: value });
    }

    render() {
        return (
        <div>
            <Progress progress={ this.state.progress } onProgressChange={ this.updateProgress }/>
            <div>
                <TimeLabel time={ 0 }/> / <TimeLabel time={ 31 }/>
            </div>
            <div>
                <TimeLabel time={ 21 }/> / <TimeLabel time={ 0 }/>
            </div>
            <div>
                <TimeLabel time={ 45 }/> / <TimeLabel time={ NaN }/>
            </div>
            <div>
                <TimeLabel time={ 709.123 }/> / <TimeLabel time={ 829 }/>
            </div>
            <div>
                <TimeLabel time={ 3721.123 }/> / <TimeLabel time={ 8456 }/>
            </div>
            <div>
                <TimeLabel time={ 3721.123 }/> / <TimeLabel time={ 7271 }/>
            </div>
        </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById("root"))