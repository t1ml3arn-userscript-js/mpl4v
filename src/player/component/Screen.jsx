import React, { useRef, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { focusNotifier } from "../../components/focus-notifier"
import scaler from './scaler-hoc'
import { RefType } from '../../utils/utils'
import { observer } from 'mobx-react-lite'
import RootStore, { StoreContext } from '../../root-store'

let Screen = observer(function Screen(props) {

    /** @type {RootStore} */
    const store = useContext(StoreContext)

    const appearance = store.appearance
    const player = store.player

    const inFullscreen = appearance.inFullscreen

    const { zoomedWidth, zoomedHeight, zoom, updateResolution, changeZoom } = props
    const { toogleFullscreen } = props
    const dragIniter = inFullscreen ? "" : "mpl4v-drag-initiator"
    const hidden = appearance.showScreen || inFullscreen ? '' : 'mpl4v--opaque'

    let styles;
    if (zoomedWidth && zoomedHeight && !inFullscreen) {
        styles = {
            width: `${zoomedWidth}px`,
            height: `${zoomedHeight}px`,
        }
    } else
        styles = null


    return (
    <div 
        className={`mpl4v-screen ${dragIniter} ${hidden}`} 
        data-fullscreen={ inFullscreen }
        style={ styles }
    >
        <video 
            ref={ props.mediaRef }
            data-fullscreen={ inFullscreen }
            className={ `${dragIniter}` }
            src={ player.mediaSrc }
            loop={ player.loop }
            onDoubleClick={ toogleFullscreen }
            onWheel={ inFullscreen ? undefined : changeZoom }
            onLoadedMetadata={ updateResolution }
            onLoadStart={ updateResolution }
        ></video>
        <Error error={ player.playerError } fullscreen={ inFullscreen }/>
        <Title  
            focusIn={ props.hudFocusIn } focusOut={ props.hudFocusOut }
            title={ player.track?.title } fullscreen={ inFullscreen } 
            fadeout={ !appearance.showControls }
        />
        <Rate playbackRate={ player.playbackRate }/>
    </div>

    )
})
Screen.propTypes = {
    toogleFullscreen: PropTypes.func.isRequired,
    mediaRef: RefType.isRequired,
    hudFocusIn: PropTypes.func,
    hudFocusOut: PropTypes.func,
    zoomedWidth: PropTypes.number.isRequired, 
    zoomedHeight: PropTypes.number.isRequired, 
    zoom: PropTypes.number.isRequired, 
    updateResolution: PropTypes.func.isRequired, 
    changeZoom: PropTypes.func.isRequired,
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

const Error = function Error(props) {
    const { error, fullscreen } = props
    const { code, message } = error || {}
    const hidden = !code && !message ? "mpl4v--hidden" : ""

    return (
    <div className={ `mpl4v-error ${hidden}` } data-fullscreen={ fullscreen } >
        <span className="mpl4v-error__label">Error :(</span>
        <span className="mpl4v-error__code">{ code }</span>
        <span className="mpl4v-error__message">{ message }</span>
    </div>
    )
}

Error.propTypes = {
    error: PropTypes.shape({
        code: PropTypes.string,
        message: PropTypes.string
    }),
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