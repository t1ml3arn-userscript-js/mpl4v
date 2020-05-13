import React from 'react'
import Bar from './Bar'
import PropTypes from 'prop-types'
import ProgressBar, { barController } from './ProgressBar'
import { toogleKey, RefType } from '../utils/utils'

export default class VolumePanel extends React.Component {
    constructor(props) {
        super(props)

        this.state = { showPanel: false }
    }

    incrementVolume = e => {
        // mod values is stored in data-volume-mod attribute
        const mod = parseInt(e.target.dataVolumeMod)

        let { volume, onVolumeChange } = this.props
        volume = volume + 10 * mod
        volume = Math.min(100, volume)
        volume = Math.max(0, volume)

        onVolumeChange(volume)
    }

    tooglePanel = () => {
        this.setState(toogleKey('showPanel'))
    }

    render() {
        // props from HOC
        const { barEltRef, startSeek, seek } = this.props
        const { toogleMute, muted } = this.props
        const { showPanel } = this.state
        // volume slider sets to zero if media is muted
        const volume = muted ? 0 : this.props.volume

        return (
        <div className="mpl4v-volume-panel-wrap">
            <div 
                className={ `mpl4v-volume-panel ${ (showPanel || seek) ? "" : "mpl4v--hidden"}` }
                onMouseLeave={ this.tooglePanel }
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
                <MuteButton toogleMute={ toogleMute } muted={ muted }/>
            </div>
            <MuteButton 
                onMouseOver={ this.tooglePanel } 
                toogleMute={ toogleMute } 
                muted={ muted }
            />
        </div>
        )
    }
}

VolumePanel.propTypes = {
    volume: PropTypes.number.isRequired,
    onVolumeChange: PropTypes.func.isRequired,
    toogleMute: PropTypes.func.isRequired,
    muted: PropTypes.bool.isRequired,
    startSeek: PropTypes.func.isRequired,
    seek: PropTypes.bool,
    barEltRef: RefType.isRequired,
}

function VolumeMod(props) {
    const { isPlus, onChange } = props
    
    return (
    <i 
        className={`zmdi ${ isPlus ? "zmdi-plus" : "zmdi-minus"} mpl4v-volume-mod`} 
        onClick={ onChange }
        data-volume-mod={ isPlus ? '1' : '-1'}
    ></i>
    )
}

VolumeMod.propTypes = {
    isPlus: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
}

const MuteButton = props => {
    const { onMouseOver, toogleMute, muted } = props
    const iconClass = muted ? 'zmdi-volume-mute' : 'zmdi-volume-up'
    return (
    <i 
        className={ `zmdi ${iconClass} mpl4v-vol-ctrl` }
        onMouseOver={ onMouseOver }
        onClick={ toogleMute }     
    ></i>
    )
}

MuteButton.propTypes = {
    onMouseOver: PropTypes.func,
    toogleMute: PropTypes.func.isRequired,
    muted: PropTypes.bool.isRequired
}

export const VolumePanelControlled = barController(VolumePanel)