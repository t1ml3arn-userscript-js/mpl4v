import React from 'react'
import PropTypes from 'prop-types'

export default class Button {}

Button.Loop = function Loop(props) {
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

Button.Loop.propTypes = {
    looped: PropTypes.bool.isRequired,
    toogleLoop: PropTypes.func.isRequired
}

Button.Play = function Play(props) {
    const { isPlaying, tooglePlayPause } = props
    const iconClass = isPlaying ? 'zmdi-pause' : 'zmdi-play'

    return (
        <i className={ `zmdi ${iconClass}`} onClick={ tooglePlayPause }>
            {props.children}
        </i>
    )
}

Button.Play.propTypes = {
    isPlaying: PropTypes.bool.isRequired,
    tooglePlayPause: PropTypes.func.isRequired,
    children: PropTypes.node,
}

export function addSpinner(EclipseTarget) {
return function Spinner(props) {
    const isActive = true;
    let classes = isActive ? 'mpl4v-eclipse--spining' : ''
    
    return (
        <EclipseTarget {...props}>
            <div className={`mpl4v-eclipse ${classes}`}></div>
        </EclipseTarget>
    )
}
}

Button.Play = addSpinner(Button.Play);