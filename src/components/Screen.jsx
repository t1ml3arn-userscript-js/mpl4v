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
            scale: 1
        }
        // TODO max width = 2 * screen width
        // TODO max height = 2 * screen height
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
            const ratio = width/height

            if (ratio >= 1) {
                // video is horizontal or square
                this.setState(state => {
                    const scale = state.scale
                    const nw = this.defaultWidth*scale
                    return {
                        screenWidth: nw,
                        screenHeight: nw/ratio
                    }
                })
            } else {
                // video is vertical
                this.setState(state => {
                    const scale = state.scale
                    const nh = this.defaultHeight * scale
                    return {
                        screenWidth: ratio * nh,
                        screenHeight: nh
                    }
                })
            }
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
                let scale = state.scale + this.scaleStep * mod
                scale = bound(scale, this.SCALE_MIN, this.SCALE_MAX)

                return {
                    scale: scale,
                    screenWidth:  w * scale,
                    screenHeight: h * scale,
                }
            })
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
        ></video>
        )
    }
}