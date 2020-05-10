import React from "react";
import PropTypes from 'prop-types'
import Bar from "./Bar";
import ProgressBar from './ProgressBar'

export default class PlaybackProgress extends ProgressBar {
    static propTypes = {
        progress: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
    }

    render() {
        const { progress } = this.props;
        const { seek } = this.state
        
        return (
        <div 
            className={ `mpl4v-playback-progressbar ${ seek ? "mpl4v-playback-progressbar--seek" : ''}` }
            ref={ this.barEltRef }
            onMouseDown={ this.startSeek }
        >
            <div className={ "mpl4v-playback-progressbar__underlay" }/>
            <Bar classes={ "mpl4v-bar-buff-color"} progress={ 90 }/>
            <Bar classes={ "mpl4v-bar-seek-color"} progress={ 60 }/>
            <Bar classes={ "mpl4v-bar-progress-color"} progress={ progress }/>
            <ProgressBar.Head classes={ "mpl4v-playback-progressbar__head" } progress={ progress }/>
        </div>
        )
    }
}