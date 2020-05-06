import React, { Component } from "react";
import PropTypes from 'prop-types'
import Bar from "./Bar";
import ProgressCalculator from "../utils/ProgressCalculator";

export default class PlaybackProgress extends Component {
    constructor(props) {
        super(props)

        this.state = {
            seek: false,
        }
        this.calculator = new ProgressCalculator()
        this.barEltRef = React.createRef()
    }

    startSeek = event => {
        // this should deisable text selection
        event.preventDefault()
        // I dont want this event to be heared
        // outside this component
        event.stopPropagation(); 

        this.calculator.init(event.nativeEvent, this.barEltRef.current, this.props.isHorizontal);
        // calc current progress in percents
        const progress = this.calculator.getProgress();

        // lift progress value up
        this.props.onProgressChange(Math.round(progress));

        // enable control
        document.addEventListener('mouseup', this.stopSeek);
        document.addEventListener('mousemove', this.seek);

        this.setState({ seek: true })
    }
    
    stopSeek = event => {
        document.removeEventListener('mouseup', this.stopSeek);
        document.removeEventListener('mousemove', this.seek);

        this.setState({ seek: false })
    }

    seek = event => {
        this.calculator.update(event);
        // calc current progress in percents
        let progress = this.calculator.getProgress()
        
        // bound it in range [0, 100]
        progress = Math.min(progress, 100)
        progress = Math.max(progress, 0)
        
        this.props.onProgressChange(Math.round(progress));
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

PlaybackProgress.propTypes = {
    progress: PropTypes.number.isRequired,
    onProgressChange: PropTypes.func.isRequired,
    isHorizontal: PropTypes.bool.isRequired
}
