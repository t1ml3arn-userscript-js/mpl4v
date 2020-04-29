import React from "react"
import ReactDOM from "react-dom"
import Progress from "./components/Progress";

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
        return <Progress progress={ this.state.progress } onProgressChange={ this.updateProgress }/>
    }
}

ReactDOM.render(<App />, document.getElementById("root"))