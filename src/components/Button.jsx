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
            title={ looped ? "Don't repeat" : "Repeat"}
            tabIndex="0"
        ></i>
    )
}

Button.Loop.propTypes = {
    looped: PropTypes.bool.isRequired,
    toogleLoop: PropTypes.func.isRequired
}

Button.Loop = React.memo(Button.Loop)

Button.Play = function Play(props) {
    const { isPlaying, tooglePlayPause } = props
    const iconClass = isPlaying ? 'zmdi-pause' : 'zmdi-play'

    return (
        <i 
            className={ `zmdi ${iconClass}`} onClick={ tooglePlayPause }
            title={ isPlaying ? 'Pause' : 'Play' }
            tabIndex="0"
        >
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
function Spinner(props) {
    const { isBuffering, ...passedProps } = props
    let classes = isBuffering ? 'mpl4v-eclipse--spining' : ''
    
    return (
        <EclipseTarget {...passedProps}>
            <div className={`mpl4v-eclipse ${classes}`}></div>
        </EclipseTarget>
    )
}

Spinner.propTypes = {
    isBuffering: PropTypes.bool
}

Spinner.defaultProps = {
    isBuffering: false
}

return Spinner

}

Button.Play = React.memo(addSpinner(Button.Play));

Button.Download = function Download(props) {
    const { downloadURL: url, saveAs } = props
    const title = url ? 'Download' : undefined

    return (
    <a 
        href={ url ? url : undefined } download={ saveAs || false } 
        title={ title }
        tabIndex="0"
    >
        <i className={ `zmdi zmdi-download ${url ? "" : "mpl4v-btn--disabled" }` }></i>
    </a>
    )
}

Button.Download.propTypes = {
    downloadURL: PropTypes.string,
    saveAs: PropTypes.string,
}

Button.Download = React.memo(Button.Download)

function Skip(props) {
    const { isNext, onClick } = props
    const skipClass = isNext ? 'zmdi-skip-next' : 'zmdi-skip-previous'
    const title = isNext ? "Play Next" : "Play Prevent"

    return (
        <i 
            className={ `zmdi ${skipClass}` } onClick={ onClick } 
            title={ title }
            tabIndex="0"
        ></i>
    )
}

Skip.propTypes = {
    isNext: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
}

Button.Skip = React.memo(Skip);