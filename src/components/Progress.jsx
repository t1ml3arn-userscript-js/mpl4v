import React, { Component } from "react";
import PropTypes from 'prop-types'

export default class PlaybackProgress extends Component {
    constructor(props) {
        super(props)

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
    }
    
    stopSeek = event => {
        document.removeEventListener('mouseup', this.stopSeek);
        document.removeEventListener('mousemove', this.seek);
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
        const headStyle = {
            left: `${progress}%`,
            // Below is a way to contain the head only
            // inside the bar, but I must know head's size.
            // marginLeft: `-${Math.round(progress*0.1)}px`
        }
        
        return (
        <div 
            className={ "mpl4v-playback-progressbar" }
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

function Bar(props) {
    const { progress, classes } = props;

    const styles = {
        width: `${progress}%`,
    };

    // what is common for hor and vert bars ?
    /* 
    .bar--hor           { width: value; height: value }
    .indicator--hor     { width: calc(); height: value }

    .bar--vert          { width: value; height: value }
    .indicator--vert    { width: value; height: calc() }
    */

    return <div className={ `mpl4v-playback-progressbar__bar mpl4v-bar--hor ${classes}` } style={ styles }></div>
}

Bar.defaultProps = {
    classes: ""
}

Bar.propTypes = {
    progress: PropTypes.number.isRequired,
    classes: PropTypes.string
}

class ProgressCalculator {
    originX;
    originY;
    currentX;
    currentY;
    elt;
    isHorizontal = true;

    constructor() {}

    /**
     * 
     * @param {MouseEvent} event 
     * @param {Element} elt 
     * @param {Boolean} isHorizontal 
     */
    init(event, elt, isHorizontal = true) {
        this.elt = elt;
        this.isHorizontal = isHorizontal;
        const e = event;
        // calculate and set origin coordinate 
        // of clicked element in page scope
        this.originX = e.pageX - e.offsetX;
        this.originY = e.pageY - e.offsetY;
        this.update(event);
    }

    /**
     * 
     * @param {MouseEvent} event 
     */
    update(event) {
        // set current mouse coord in page scope
        this.currentX = event.pageX;
        this.currentY = event.pageY;
    }

    /**
     * Returns progress, in percents.
     * NOTE: returned value is not bounded
     * and can be less than 0 or greater than 100
     * @returns {Number}
     */
    getProgress() {
        const rect = this.elt.getBoundingClientRect()
        const size = this.isHorizontal ? rect.width : rect.height
        const path = this.isHorizontal ? this.currentX-this.originX : this.currentY-this.originY;
        return path * 100 / size;
    }
}