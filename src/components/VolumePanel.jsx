import React from 'react'
import Bar from './Bar'
import PropTypes from 'prop-types'
import ProgressBar, { barController } from './ProgressBar'
import { RefType } from '../utils/utils'

const NOSOUND = 0
const MUTED = 1
const UNMUTED = 2

class VolumePanelView extends React.Component {
    constructor(props) {
        super(props)

        this.state = { showPanel: false }
    }

    incrementVolume = e => {
        // mod values is stored in data-volume-mod attribute
        const mod = parseInt(e.target.dataset.volumeMod)

        let { volume, onVolumeChange } = this.props
        volume = volume + 10 * mod
        volume = Math.min(100, volume)
        volume = Math.max(0, volume)

        onVolumeChange(volume)
    }

    hidePanel = () => this.setState({ showPanel: false })
    showPanel = () => this.setState({ showPanel: true })

    render() {
        // props from HOC
        const { barEltRef, startSeek, seek } = this.props

        const { toogleMute, muted, hasAudio, seekByUser } = this.props
        const { showPanel } = this.state
        // volume slider sets to zero if media is muted
        const volume = muted ? 0 : this.props.volume

        const soundState = !hasAudio ? NOSOUND
            : muted ?       MUTED
            : volume == 0 ? MUTED
            :               UNMUTED

        const panelCanBeShown = !seekByUser && hasAudio

        return (
        <div className="mpl4v-volume-panel-wrap">
            <div 
                className={ `mpl4v-volume-panel ${ (showPanel || seek) ? "" : "mpl4v--hidden"}` }
                onMouseLeave={ this.hidePanel }
                onMouseOver={ this.showPanel }
            >
                <VolumeMod isPlus={ false } onChange={ this.incrementVolume }/>
                <div 
                    className={ 'mpl4v-volume-bar' }
                    ref={ barEltRef }
                    onMouseDown={ startSeek }
                >
                    <div className="mpl4v-volume-bar__underlay"></div>
                    <Bar classes={ 'mpl4v-bar-progress-color' } progress={ volume }/>
                    <ProgressBar.Head classes={ "mpl4v-volume-bar__head" } progress={ volume }/>
                </div>
                <VolumeMod isPlus={ true } onChange={ this.incrementVolume }/>
                <MuteButton toogleMute={ toogleMute } soundState={ soundState }/>
            </div>
            <MuteButton 
                onMouseOver={ panelCanBeShown ? this.showPanel : undefined }
                onMouseMove={ (panelCanBeShown && !(seek || showPanel)) ? this.showPanel : undefined }
                toogleMute={ toogleMute } 
                soundState={ soundState }
            />
        </div>
        )
    }
}

VolumePanelView.propTypes = {
    volume: PropTypes.number.isRequired,
    onVolumeChange: PropTypes.func.isRequired,
    toogleMute: PropTypes.func.isRequired,
    muted: PropTypes.bool.isRequired,
    startSeek: PropTypes.func.isRequired,
    seek: PropTypes.bool,
    barEltRef: RefType.isRequired,
    seekByUser: PropTypes.bool.isRequired,
    hasAudio: PropTypes.bool.isRequired,
}

function VolumeMod(props) {
    const { isPlus, onChange } = props
    const title = isPlus ? "Increase Volume" : "Decrease Volume"

    return (
    <i 
        className={`zmdi ${ isPlus ? "zmdi-plus" : "zmdi-minus"} mpl4v-volume-mod`} 
        onClick={ onChange }
        data-volume-mod={ isPlus ? '1' : '-1'}
        title={ title }
    ></i>
    )
}

VolumeMod.propTypes = {
    isPlus: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
}

const MuteButton = props => {
    const { onMouseOver, toogleMute, soundState, onMouseMove } = props

    let iconClass, title
    if (soundState == NOSOUND) {
        iconClass = "zmdi-volume-mute"
        title = "No Sound"
    } else if (soundState == MUTED) {
        iconClass = 'zmdi-volume-off'
        title = "Unmute"
    } else {
        iconClass = "zmdi-volume-up"
        title = "Mute"
    }

    const disabled = soundState == NOSOUND ? "mpl4v-btn--disabled" : ""

    return (
    <i 
        className={ `zmdi ${iconClass} mpl4v-vol-ctrl ${disabled}` }
        onMouseOver={ onMouseOver }
        onMouseMove={ onMouseMove }
        onClick={ toogleMute }
        title={ title }
    ></i>
    )
}

MuteButton.propTypes = {
    onMouseOver: PropTypes.func,
    onMouseMove: PropTypes.func,
    toogleMute: PropTypes.func.isRequired,
    soundState: PropTypes.oneOf([MUTED, NOSOUND, UNMUTED]).isRequired,
}

const VolumePanel = barController(VolumePanelView)
export default VolumePanel