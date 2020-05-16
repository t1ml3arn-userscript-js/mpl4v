import React from 'react'
import PropTypes from 'prop-types'
import { bound } from '../utils/utils'

export default function Screen(props) {

    // TODO set defaultMuted (which is an attribute)
    // when component mounts ?
    const {showScreen, toogleFullscreen, fullscreen} = props
    const { mediaSrc } = props
    const { looped } = props
    const dragIniter = fullscreen ? "" : "mpl4v-drag-initiator"
    const hidden = showScreen ? '' : 'mpl4v--hidden'

    return (
    <video 
        ref={ props.mediaRef }
        className={`mpl4v-screen ${dragIniter} ${hidden}`}
        data-fullscreen={ fullscreen }
        onDoubleClick={ toogleFullscreen }
        src={ mediaSrc }
        loop={ looped }
    ></video>
    )
}

Screen.propTypes = {
    showScreen: PropTypes.bool.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    toogleFullscreen: PropTypes.func.isRequired,
    mediaSrc: PropTypes.string,
    looped: PropTypes.bool.isRequired,
    mediaRef: PropTypes.object
}

export class NewScreen extends React.Component {

    scaleStep = 0.1

    SCALE_MIN = 0.25
    SCALE_MAX = 4

    constructor(props) {
        super(props)

        this.state = { 
            scale: 1,
            zoomHor: null,
            zoomVert: null,
            screenWidth: 0,
            screenHeight: 0,
        }

        this.preserveSize = true

        // TODO max width = 2 * screen width
        // TODO max height = 2 * screen height
    }

    static getDerivedStateFromProps(props, state) {
        // The point:
    /* 
        I get new video sizes (width and height) as props.
        I have to update video elt size (and position and so on)
        based on new data.
        (w, h) => ({ w: new_w, h: new_h })
    */
        return null
    }

    componentDidMount() {
        const video = this.props.mediaRef.current
        const rect = video.getBoundingClientRect()

        this.defaultWidth = rect.width
        this.defaultHeight = rect.height
    }

    updateResolution = (e) => {
        const video = this.props.mediaRef.current

        const width = video.videoWidth
        const height = video.videoHeight

        if (width && height) {
            this.setState(state => {
                if (this.preserveSize)
                    return this.preserveSizeHandler_v2(width, height, state)
                else
                    return this.applyCurrentScale(width, height, state)
            })
        } else {
            this.setState({ screenWidth: this.defaultWidth, screenHeight: this.defaultHeight })
        }
    }

    changeScale = e => {
        e.preventDefault()

        // scroll down - decrease scale, deltaY > 0
        // scroll up - increase scale, deltaY < 0
        const mod = e.deltaY > 0 ? -1 : 1

        const video = this.props.mediaRef.current
        const w = video.videoWidth, h = video.videoHeight
        // scale only when we have video dimension 
        if (w && h) 
            this.setState(state => {
                // return this.getSharedScale(w,h,mod,state)
                return this.getIndieScale(w, h, mod, state)
            })
    }

    getSharedScale = (w, h, mod, state) => {
        let scale = state.scale + this.scaleStep * mod
        scale = bound(scale, this.SCALE_MIN, this.SCALE_MAX)
        
        return {
            scale: scale,
            screenWidth:  w * scale,
            screenHeight: h * scale,
        }
    }
    
    getIndieScale = (w, h, mod, state) => {
        const ratio = w / h
        let scale = ratio >= 1 ? state.zoomHor : state.zoomVert
        scale += mod * this.scaleStep
        scale = bound(scale, this.SCALE_MIN, this.SCALE_MAX)
        console.log(scale)
        const result = 
         { 
            [ratio >= 1 ? 'zoomHor' : 'zoomVert']: scale,
            screenWidth: w * scale, 
            screenHeight: h * scale,
        }

        return result
    }

    preserveSizeHandler_v2 = (w, h, state) => {
        const ratio = w / h

        if (ratio >= 1) {
            const scale = state.zoomHor
            const screenWidth = scale === null ? this.defaultWidth : state.screenWidth
            const screenHeight = screenWidth / ratio

            return { 
                zoomHor: screenWidth / w,
                screenHeight, 
                screenWidth, 
            }
        } else {
            let { zoomVert, screenHeight } = state
            // if no scale, then set width to default and scale height with ratio
            // if scale, then scale height with its value, then scale width with ratio
            let screenWidth
            if (zoomVert == null) {
                screenWidth = this.defaultWidth
                screenHeight = this.defaultWidth / ratio
            } else {
                screenWidth = screenHeight * ratio
            }

            return {
                screenWidth, screenHeight,
                zoomVert: screenHeight / h,
            }
        }
    }

    preserveSizeHandler = (w, h, state) => {
        const ratio = w/h
        
        if (ratio >= 1) {
            // preserve width for horizontal video
            const newWidth = (state.screenWidth || this.defaultWidth)
            return {
                scale: newWidth / w,
                screenWidth:    newWidth,
                screenHeight:   newWidth / ratio
            }
        } else {
            // preserve height for vertical video
            let new_h = h * state.scale
            const ah = window.screen.availHeight
            const new_r = new_h / ah

            // change scale only if new scaled height exceeds screen height
            new_h = new_r > 1 ? ah : new_h
            const new_w = new_h * ratio

            return {
                scale: new_h / h,
                screenHeight:   new_h,
                screenWidth:    new_w
            }
        }
    }

    applyCurrentScale = (w, h, state) => {
        const scale = state.scale
        const ratio = w/h
        const nw = this.defaultWidth*scale
        return {
            screenWidth: nw,
            screenHeight: nw/ratio
        }
    }

    render() {
        const props = this.props
        const {showScreen, toogleFullscreen, fullscreen} = props
        const { mediaSrc } = props
        const { looped } = props
        const dragIniter = fullscreen ? "" : "mpl4v-drag-initiator"
        const hidden = showScreen ? '' : 'mpl4v--hidden'
        const { screenWidth, screenHeight } = this.state

        let styles;
        if (screenWidth && screenHeight && !fullscreen) {
            styles = {
                width: `${screenWidth}px`,
                height: `${screenHeight}px`,
                marginLeft: `-${screenWidth * 0.5}px`
            }
        } else
            styles = null

        return (
        <video 
            ref={ props.mediaRef }
            className={`mpl4v-screen ${dragIniter} ${hidden}`}
            data-fullscreen={ fullscreen }
            src={ mediaSrc }
            loop={ looped }
            onDoubleClick={ toogleFullscreen }
            onWheel={ fullscreen ? undefined : this.changeScale }
            onLoadedMetadata={ this.updateResolution }
            style={ styles }
            onLoadStart={ this.updateResolution }
        ></video>
        )
    }
}