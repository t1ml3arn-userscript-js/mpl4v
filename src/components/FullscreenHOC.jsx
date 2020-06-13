import React, { Component } from 'react'
import fscreen from 'fscreen'

export function fullscreenHOC(Target) {
    return class FullscreenCtrl extends Component {
        constructor(props) {
            super(props)

            this.fullscreenEltRef = React.createRef()
        }

        requestFullscreen = () => fscreen.requestFullscreen(this.fullscreenEltRef.current)

        render() {
            const {classes, ...passedDown} = this.props
            return (
            <div className={ classes } ref={ this.fullscreenEltRef } >
                <Target 
                    requestFullscreen={ this.requestFullscreen }
                    { ...passedDown }
                />
            </div>
            )
        }
    }
}
