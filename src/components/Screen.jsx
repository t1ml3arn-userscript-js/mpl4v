import React from 'react'
import PropTypes from 'prop-types'
import { bound, magnetValue } from '../utils/utils'

export default class Screen extends React.Component {

    static propTypes = {
        showScreen: PropTypes.bool.isRequired,
        fullscreen: PropTypes.bool.isRequired,
        toogleFullscreen: PropTypes.func.isRequired,
        mediaSrc: PropTypes.string,
        looped: PropTypes.bool.isRequired,
        mediaRef: PropTypes.object
    }

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
            previousWidth: 0, 
            previousHeight: 0,
        }

        this.restoresSize = true

        // TODO(?) max width = 2 * screen width
        // TODO(?) max height = 2 * screen height
    }

    componentDidMount() {
        const video = this.props.mediaRef.current
        const rect = video.getBoundingClientRect()

        this.defaultWidth = rect.width
        this.defaultHeight = rect.height
    }

    updateResolution = () => {
        const video = this.props.mediaRef.current

        const width = video.videoWidth
        const height = video.videoHeight

        if (width && height) {
            this.setState(state => {
                if (this.restoresSize)
                    return this.restoreSizeHandler(width, height, state)
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
        const r = w / h

        let scale = r >= 1 ? state.zoomHor : state.zoomVert
        scale += mod * this.scaleStep
        scale = bound(scale, this.SCALE_MIN, this.SCALE_MAX)
        
        // I want to magnet screen width to control width (this.defaultWidth).
        // With this, whatever the width value might become through zooming, 
        // it will never skip desired width (this.defaultWidth)
        // So, here we go:
        // 1. magnet target value
        const newWidth = magnetValue(state.screenWidth, w * scale, this.defaultWidth)
        // 2. recalc scale value
        scale = newWidth / w

        const zoomKey = r >= 1 ? 'zoomHor' : 'zoomVert'
        const prevSizeKey = r >= 1 ? 'previousWidth' : 'previousHeight'
        const prevSizeValue = r >= 1 ? w * scale : h * scale

        magnetValue()
        const result = { 
            [zoomKey]: scale,
            [prevSizeKey]: prevSizeValue,
            screenWidth: w * scale, 
            screenHeight: h * scale,
        }

        return result
    }

    restoreSizeHandler = (w, h, state) => {
        const ratio = w / h

        if (ratio >= 1) {
            const scale = state.zoomHor
            let screenWidth = scale === null ? this.defaultWidth : state.previousWidth
            const screenHeight = screenWidth / ratio

            return { 
                zoomHor: screenWidth / w,
                screenHeight, 
                screenWidth,
                // prev WIDTH must be stored separately from prev HEIGHT
                // point is the same as with separate zoom factor
                previousWidth: screenWidth,
            }
        } else {
            let { zoomVert, previousHeight } = state
            // if no scale, then set width to default and scale height with ratio
            // if scale, then scale height with its value, then scale width with ratio
            let screenWidth, screenHeight
            if (zoomVert == null) {
                screenWidth = this.defaultWidth
                screenHeight = this.defaultWidth / ratio
            } else {
                screenHeight = previousHeight
                screenWidth = previousHeight * ratio
            }

            return {
                screenWidth, screenHeight,
                zoomVert: screenHeight / h,
                // prev HEIGHT must be stored separately from prev WIDTH
                // point is the same as with separate zoom factor
                previousHeight: screenHeight,
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