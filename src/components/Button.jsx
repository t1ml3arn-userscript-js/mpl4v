import React from 'react'
import PropTypes from 'prop-types'

export default class Button {}

Button.Loop = Loop

function Loop(props) {
    const { looped, toogleLoop } = props
    return (
        <i className="zmdi zmdi-repeat" onClick={ toogleLoop }></i>
    )
}

Loop.propTypes = {
    looped: PropTypes.bool.isRequired,
    toogleLoop: PropTypes.func.isRequired
}