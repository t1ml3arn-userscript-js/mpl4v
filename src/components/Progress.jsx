import React, { Component } from "react";
import PropTypes from 'prop-types'
import Bar from "./Bar";
import ProgressBar from './ProgressBar'

export default class PlaybackProgress extends ProgressBar {
    static propTypes = {
        progress: PropTypes.number.isRequired,
        onProgressChange: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)
    }

    render() {
        const { progress } = this.props;
        const { seek } = this.state
        const headStyle = {
            left: `${progress}%`,
            // Below is a way to contain the head only
            // inside the bar, but I must know head's size.
            // marginLeft: `-${Math.round(progress*0.1)}px`
        }
        
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
            <div style={ headStyle } className={ "mpl4v-playback-progressbar__head" }></div>
        </div>
        )
    }
}