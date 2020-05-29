import React, { PureComponent } from 'react'
import { bound, magnetValue, RefType } from '../utils/utils'

const MIN_WIDTH = 50
const MIN_HEIGHT = 50
const MAX_SCALE = 4
const SCALE_STEP = 0.1

export default function scaler(Target) {

return class Scaler extends PureComponent {

    static propTypes = {
        videoEltRef: RefType.isRequired,
    }

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
    }

    componentDidMount() {
        const video = this.props.videoEltRef.current
        const rect = video.getBoundingClientRect()

        this.defaultWidth = rect.width
        this.defaultHeight = rect.height
    }

    updateResolution = () => {
        const video = this.props.videoEltRef.current

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

        const video = this.props.videoEltRef.current
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
        const { videoEltRef, ...passedProps } = this.props
        const { scale } = this.state

        return (
        <Target
            scaledWidth={0} 
            scaledHeight={0}
            scaleFactor={ scale }
            updateResolution={ this.updateResolution }
            changeScaleHandler={ this.changeScale }
            {...passedProps}
        />
        )
    }
}

}