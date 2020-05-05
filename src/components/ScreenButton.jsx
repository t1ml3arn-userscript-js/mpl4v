import React from 'react'
import PropTypes from 'prop-types'

export default function ScreenButton(props) {
    const {showScreen, toogleScreen, fullscreen} = props;
    let title = ''
    if (fullscreen)         title = 'Exit Fullscreen Mode'
    else if (showScreen)    title = 'Fold Screen'
    else                    title = 'Show Screen'

    return (
    <i 
        className={`zmdi mpl4v-fullscreen ${showScreen ? "zmdi-unfold-less" : "zmdi-unfold-more"}`} 
        onClick={toogleScreen}
        title={ title }
    ></i>
    )    
}

ScreenButton.propTypes = {
    showScreen: PropTypes.bool.isRequired,
    toogleScreen: PropTypes.func.isRequired,
    fullscreen: PropTypes.bool.isRequired,
}