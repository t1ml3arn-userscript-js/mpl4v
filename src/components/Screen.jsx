import React from 'react'
import PropTypes from 'prop-types'

export default class Screen extends React.Component {
    constructor(props) {
        super(props)

        this.mediaRef = React.createRef()
    }

    componentDidUpdate = (prevProps) => {
        const video = this.mediaRef.current
        
        if (this.props.volume != prevProps.volume)
            video.volume = this.props.volume
    }

    render() {
        const {showScreen, toogleFullscreen, fullscreen} = this.props
        const { mediaSrc , muted, volume} = this.props
        const { looped } = this.props
        const dragIniter = fullscreen ? "" : "mpl4v-drag-initiator"
        const hidden = showScreen ? '' : 'mpl4v--hidden'

        return (
        <video 
            ref={ this.mediaRef }
            className={`mpl4v-screen ${dragIniter} ${hidden}`}
            data-fullscreen={ fullscreen }
            onDoubleClick={ toogleFullscreen }
            src={ mediaSrc }
            muted={ muted }
            loop={ looped }
        ></video>
        )
    }
}

Screen.propTypes = {
    showScreen: PropTypes.bool.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    toogleFullscreen: PropTypes.func.isRequired,
    mediaSrc: PropTypes.string,
    volume: PropTypes.number.isRequired,
    muted: PropTypes.bool.isRequired,
    looped: PropTypes.bool.isRequired,
}