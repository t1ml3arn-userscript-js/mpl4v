import React from 'react'
import PropTypes from 'prop-types'

export default function ScreenButton(props) {
    const {showScreen, toogleScreen} = props;

    return (
    <i 
        className={`zmdi mpl4v-fullscreen ${showScreen ? "zmdi-unfold-less" : "zmdi-unfold-more"}`} 
        onClick={toogleScreen}
    ></i>
    )    
}

ScreenButton.propTypes = {
    showScreen: PropTypes.bool.isRequired,
    toogleScreen: PropTypes.func.isRequired,
}