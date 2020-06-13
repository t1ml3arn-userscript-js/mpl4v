import React, { useState } from 'react'
import Bar from './Bar'

const Screen = props => {
    const style ={}
    return (
        <div 
            style={ style } className="screen"
            data-fullscreen={ props.fullscreen }
        ></div>
        )
    }
    
const Controls = props => {
    const style ={}
    return (
        <div style={ style } className="controls"
            data-fullscreen={ props.fullscreen }
        ></div>
    )
}

const DummyPlayer = props => {
    const style = {
        position: 'fixed',
        bottom: '50px',
        right: '50px',
    }
    const {fullscreen} = props
    return (
        <div 
            style={style} 
            tabIndex="0"
            className="player"
            data-fullscreen={ fullscreen }
        >
            <Screen fullscreen={fullscreen} />
            <Controls fullscreen={fullscreen} />
        </div>
    )
}

function switchFullscreen(event, setFullscreen) {
    const e = event.nativeEvent
    
    if (e.code !== "KeyF")  return

    if (document.fullscreenElement) {
        document.exitFullscreen()
        setFullscreen(false)
    } else {
        event.currentTarget.requestFullscreen()
        setFullscreen(true)
    }
}

const FullscreenWrap = Target => {
    return function FullscreenWrap(props) {
        const style = {
        }
        let [fullscreen, setFullscreen ] = useState(false)
        // fullscreen = false

        // get position from elt's bounds -> BOUNDS
        // position elt as fixed
        // set elt coords from BOUNDS
        // apply class to style
        return (
            <div 
                className="fs-wrap"
                style={style} id="fs-wrap"
                // onKeyDown={switchFullscreen}
                onKeyDown={ e => switchFullscreen(e, setFullscreen)}
                data-fullscreen={ fullscreen }
            >
                <Target fullscreen={fullscreen} {...props} />
            </div>
        )
    }
}

export { DummyPlayer, FullscreenWrap }
