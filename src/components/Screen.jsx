import React from 'react'
import fscreen from 'fscreen'

export default class Screen extends React.Component {
    constructor(props) {
        super(props)
        
        // this.screenRef = React.createRef();
    }

    requestFullscreen = e => {
        const result = fscreen.requestFullscreen(e.target)
        // if there is a result, it is Promise
        if (result)
            result.then(this.fullscreenSucceeded, this.fullscreenFailed)
        else {
            // TODO lift this fullscreen dancing up
            // and control it with event handler, not a Promise
            // opera and safari does not return promise
            document.fullscreenEnabled 
                ? this.fullscreenSucceeded() 
                : this.fullscreenFailed()
        }
    }

    fullscreenSucceeded = () => {
        console.log(this, 'succeeded')
        this.props.enterFullscreen()
    }

    fullscreenFailed = e => {
        console.log('fullscreen failed with error:', e)
    }

    render() {
        const {showScreen} = this.props
        return (
        <div 
            className={`mpl4v-screen mpl4v-drag-initiator ${showScreen ? '' : 'mpl4v--hidden'}`}
            onDoubleClick={ this.requestFullscreen }
        >
        </div>
        )
    }
}