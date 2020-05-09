import React from 'react'
import PropTypes from 'prop-types'

export default function Screen(props) {
    const {showScreen, toogleFullscreen, fullscreen} = props
    const { mediaSrc , muted, volume} = props
    const dragIniter = fullscreen ? "" : "mpl4v-drag-initiator"
    const hidden = showScreen ? '' : 'mpl4v--hidden'

    return (
    <div 
        className={`mpl4v-screen ${dragIniter} ${hidden}`}
        data-fullscreen={ fullscreen }
        onDoubleClick={ toogleFullscreen }
    ></div>
    )
}

Screen.propTypes = {
    showScreen: PropTypes.bool.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    toogleFullscreen: PropTypes.func.isRequired,
    mediaSrc: PropTypes.string,
    volume: PropTypes.number.isRequired,
    muted: PropTypes.bool.isRequired
}