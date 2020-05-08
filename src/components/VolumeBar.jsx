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
        volume = (volume + 0.1 * mod) * 100
        volume = Math.min(100, volume)
        volume = Math.max(0, volume)
        onChange(volume)
    }

    tooglePanel = e => {
        this.setState(toogleKey('showPanel'))
    }

    render() {
        const { volume } = this.props
        const { showPanel, seek } = this.state
        const headStyle = {
            left: `${ volume * 100 }%`
        }

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
                    <Bar classes={ 'mpl4v-bar-progress-color' } progress={ volume * 100 }/>
                    <div style={ headStyle } className={ "mpl4v-volume-bar__head " }></div>
                </div>
                <VolumeMod isPlus={ true } onChange={ this.incrementVolume }/>
            </div>
            <MuteButton onMouseOver={ this.tooglePanel }/>
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
    return (
    <i className="zmdi zmdi-volume-up mpl4v-vol-ctrl" {...props} ></i>
    )
}