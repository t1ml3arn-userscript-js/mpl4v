import React from 'react'
import Bar from './Bar'
import PropTypes from 'prop-types'
import ProgressBar from './ProgressBar'
import { toogleKey } from '../utils/utils'

export default class Volume extends ProgressBar {
    constructor(props) {
        super(props)

        this.incrementVolume = this.incrementVolume.bind(this)
    }

    incrementVolume(mod) {
        let { volume, onChange } = this.props
        volume = volume + 10 * mod
        volume = Math.min(100, volume)
        volume = Math.max(0, volume)
        onChange(volume)
    }

    tooglePanel = e => {
        this.setState(toogleKey('showPanel'))
    }

    render() {
        const { toogleMute, muted } = this.props
        const { showPanel, seek } = this.state
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
                    ref={ this.barEltRef }
                    onMouseDown={ this.startSeek }
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

Volume.propTypes = {
    volume: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
}

function VolumeMod(props) {
    const { isPlus, onChange } = props
    const clickHandler = isPlus ? e => onChange(1) : e => onChange(-1)
    return (
    <i 
        className={`zmdi ${ isPlus ? "zmdi-plus" : "zmdi-minus"} mpl4v-volume-up`} 
        onClick={ clickHandler }
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