import React from 'react'
import PropType from 'prop-types'

export default function Screen(props) {
    const {showScreen, requestFullscreen, fullscreen} = props
    const dragIniter = fullscreen ? "" : "mpl4v-drag-initiator"
    const hidden = showScreen ? '' : 'mpl4v--hidden'
    
    return (
    <div 
        className={`mpl4v-screen ${dragIniter} ${hidden}`}
        data-fullscreen={ fullscreen }
        onDoubleClick={ requestFullscreen }
    ></div>
    )
}

Screen.propTypes = {
    showScreen: PropType.bool.isRequired,
    requestFullscreen: PropType.func.isRequired,
    fullscreen: PropType.bool.isRequired,
}