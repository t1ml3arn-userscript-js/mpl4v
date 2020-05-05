import React, { Component } from "react";
import PropTypes from 'prop-types'

export default class Progress extends Component {
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
        
        return (
            <div 
                className={ "mpl4v-progress-bar" }
                ref={ this.barEltRef }
                onMouseDown={ this.startSeek }
            >
                <Bar progress={ progress }/>
            </div>
        )
    }
}

Progress.propTypes = {
    progress: PropTypes.number.isRequired,
    onProgressChange: PropTypes.func.isRequired,
    isHorizontal: PropTypes.bool.isRequired
}

function Bar(props) {
    const { progress } = props;

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

    return <div className={ "mpl4v-progress__bar--hor" } style={ styles }></div>
}

Bar.propTypes = {
    progress: PropTypes.number.isRequired,
    // className: PropTypes.string.isRequired,
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
        this.currentX = event.x;
        this.currentY = event.y;
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