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