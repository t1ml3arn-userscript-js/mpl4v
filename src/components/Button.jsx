import React from 'react'
import PropTypes from 'prop-types'

export default class Button {}

Button.Loop = Loop

function Loop(props) {
    const { looped, toogleLoop } = props
    const toogledClass = looped ? 'mpl4v--toogled' : '';

    return (
        <i 
            className={ `zmdi zmdi-repeat ${toogledClass}` } 
            onClick={ toogleLoop }
            title={ looped ? "don't repeat" : "repeat"}
        ></i>
    )
}

Loop.propTypes = {
    looped: PropTypes.bool.isRequired,
    toogleLoop: PropTypes.func.isRequired
}

Button.Play = function Play(props) {
    const { isPlaying, tooglePlayPause } = props
    const iconClass = isPlaying ? 'zmdi-pause' : 'zmdi-play'

    return (
        <i className={ `zmdi ${iconClass}`} onClick={ tooglePlayPause }></i>
    )
}

Button.Play.propTypes = {
    isPlaying: PropTypes.bool.isRequired,
    tooglePlayPause: PropTypes.func.isRequired,
}