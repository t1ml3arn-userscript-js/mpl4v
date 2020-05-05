import React from 'react'
import PropType from 'prop-types'

export default function Screen(props) {
    const {showScreen, requestFullscreen, fullscreen} = props
    return (
    <div 
        className={`mpl4v-screen mpl4v-drag-initiator ${showScreen ? '' : 'mpl4v--hidden'}`}
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