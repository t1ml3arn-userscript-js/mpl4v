import React from 'react'
import PropTypes from 'prop-types'

export default function Button() {}

/** 
 * Triggers click when when single key (Enter os Spacebar)
 * is pressed
*/
function triggerClick(e) {
    if (e.getModifierState())  return
    if (e.key == "Enter" || e.key == " " || e.key == "Spacebar")
        e.currentTarget.click()
}

function BareBtn(props) {
    const { classes, onClick, title, children } = props
    return (
        <i
            className={ `zmdi ${classes}`}
            onClick={ onClick }
            onKeyDown={ triggerClick }
            title={ title }
            tabIndex="0"
        >
            { children }
        </i>
    )
}

BareBtn.propTypes = {
    classes: PropTypes.string,
    onClick: PropTypes.func,
    title: PropTypes.string,
    children: PropTypes.node,
}

Button.Loop = function Loop(props) {
    const { looped, toogleLoop } = props
    const toogledClass = looped ? 'mpl4v--toogled' : '';

    return (
        <BareBtn 
            classes={ `zmdi-repeat ${toogledClass}` } 
            onClick={ toogleLoop }
            title={ looped ? "Don't repeat" : "Repeat"}
        />
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
        <BareBtn 
            classes={ iconClass }
            onClick={ tooglePlayPause }
            title={ isPlaying ? 'Pause' : 'Play' }
        >
            { props.children }
        </BareBtn>
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
        onKeyDown={ triggerClick }
    >
        <BareBtn classes={ `zmdi-download ${url ? "" : "mpl4v-btn--disabled" }` }/>
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

    return <BareBtn classes={ skipClass } onClick={ onClick } title={ title }/>
}

Skip.propTypes = {
    isNext: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
}

Button.Skip = React.memo(Skip);

function Screen(props) {
    const {showScreen, toogleScreen, fullscreen} = props;
    
    let title = ''
    if (fullscreen)         title = 'Exit Fullscreen Mode'
    else if (showScreen)    title = 'Fold Screen'
    else                    title = 'Show Screen'

    const iconClass = fullscreen ? "zmdi-fullscreen-exit" 
        : showScreen ? "zmdi-unfold-less" 
        : "zmdi-unfold-more"

    return (
        <BareBtn 
            classes={ `mpl4v-fullscreen ${iconClass}` }
            onClick={ toogleScreen }
            title={ title }
        />
    )
}

Screen.propTypes = {
    showScreen: PropTypes.bool.isRequired,
    toogleScreen: PropTypes.func.isRequired,
    fullscreen: PropTypes.bool.isRequired,
}

Button.Screen = React.memo(Screen)