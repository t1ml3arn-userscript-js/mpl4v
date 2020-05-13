import React from 'react'
import PropTypes from 'prop-types'

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