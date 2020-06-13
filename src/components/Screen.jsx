import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { focusNotifier } from "./focusNotifierHOC"
import scaler from './Scaler'
import { RefType } from '../utils/utils'

let Screen = function Screen(props) {
    const { zoomedWidth, zoomedHeight, zoom, updateResolution, changeZoom } = props

    const {showScreen, fullscreen, hideScreenHUD} = props
    const { toogleFullscreen } = props
    const { mediaSrc, title } = props
    const { looped, playbackRate } = props
    const dragIniter = fullscreen ? "" : "mpl4v-drag-initiator"
    const hidden = showScreen ? '' : 'mpl4v--opaque'
    const { error } = props

    let styles;
    if (zoomedWidth && zoomedHeight && !fullscreen) {
        styles = {
            width: `${zoomedWidth}px`,
            height: `${zoomedHeight}px`,
        }
    } else
        styles = null

    return (
    <div 
        className={`mpl4v-screen ${dragIniter} ${hidden}`} 
        data-fullscreen={ fullscreen }
        style={ styles }
    >
        <video 
            ref={ props.mediaRef }
            data-fullscreen={ fullscreen }
            className={ `${dragIniter}` }
            src={ mediaSrc }
            loop={ looped }
            onDoubleClick={ toogleFullscreen }
            onWheel={ fullscreen ? undefined : changeZoom }
            onLoadedMetadata={ updateResolution }
            onLoadStart={ updateResolution }
        ></video>
        <Error { ...error } fullscreen={ fullscreen }
        />
        <Title  
            focusIn={ props.hudFocusIn } focusOut={ props.hudFocusOut }
            title={ title } fullscreen={ fullscreen } fadeout={ hideScreenHUD }
        />
        <Rate playbackRate={ playbackRate }/>
    </div>

    )
}
Screen.propTypes = {
    showScreen: PropTypes.bool.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    toogleFullscreen: PropTypes.func.isRequired,
    mediaSrc: PropTypes.string,
    looped: PropTypes.bool.isRequired,
    mediaRef: RefType,
    title: PropTypes.string,
    error: PropTypes.object,
    hideScreenHUD: PropTypes.bool.isRequired,
    hudFocusIn: PropTypes.func,
    hudFocusOut: PropTypes.func,
    zoomedWidth: PropTypes.number.isRequired, 
    zoomedHeight: PropTypes.number.isRequired, 
    zoom: PropTypes.number.isRequired, 
    updateResolution: PropTypes.func.isRequired, 
    changeZoom: PropTypes.func.isRequired,
    playbackRate: PropTypes.number.isRequired
}
Screen = scaler(Screen)
export default Screen

let Title = props => {
    const { title, fullscreen, fadeout } = props
    const hidden = title ? "" : "mpl4v--hidden"
    const fade = !fullscreen ? "" 
        : fadeout ? "mpl4v-trans--fade-out" : "mpl4v-trans--fade-in"

    return (
    <span 
        className={ `mpl4v-screen-title ${hidden} ${fade}` } 
        data-fullscreen={ fullscreen } 
    >
        { title }
    </span>
    )
}

Title.propTypes = {
    title: PropTypes.string,
    fullscreen: PropTypes.bool.isRequired,
    fadeout: PropTypes.bool,
}

Title = React.memo(focusNotifier(Title))

const Error = React.memo(function Error(props) {
    const { code, message, fullscreen } = props
    const hidden = !code && !message ? "mpl4v--hidden" : ""

    return (
    <div className={ `mpl4v-error ${hidden}` } data-fullscreen={ fullscreen } >
        <span className="mpl4v-error__label">Error :(</span>
        <span className="mpl4v-error__code">{ code }</span>
        <span className="mpl4v-error__message">{ message }</span>
    </div>
    )
})

Error.propTypes = {
    code: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool.isRequired,
}

let Rate = props => {
    const { playbackRate } = props
    const rateRef = useRef(null)
    
    useEffect(() => {
        rateRef.current.classList.remove('mpl4v-rate--fade')
        // triggering offset allows to reset current animation
        rateRef.current.offsetWidth
        rateRef.current.classList.add('mpl4v-rate--fade')
    })

    return (
    <span 
        className={ `mpl4v-rate` }
        ref={rateRef}
    >
        { `x${playbackRate}` }
    </span>
    )
}

Rate.propTypes = {
    playbackRate: PropTypes.number.isRequired
}

Rate = React.memo(Rate)