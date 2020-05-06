import React from 'react'
import ProgressCalculator from '../utils/ProgressCalculator';
import PropTypes from 'prop-types'
import Bar from './Bar';

/**
 * Basic code to control progress bar.
 * Component does not have render(), you should implement
 * it in a subclass.
 * 
 * Properties:
 *  progress:number is required - indicates current progress
 *  onChange:func is required - callback to dispatch progress changing
 *  isHorizontal:bool - direction(horizontal or vertical), default is true
 * 
 * State:
 *  seek:bool - shows wether the component in seek mode (controlled by user)
 *  
 * Refs:
 *  barEltRef - refers to an element that is progressbar, 
 *              the element's width(or height) is used to calculate progress
 */
class ProgressBar extends React.Component {
    static propTypes = {
        progress: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
        isHorizontal: PropTypes.bool
    }

    static defaultProps = {
        isHorizontal: true
    }

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
        this.props.onChange(Math.round(progress));

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
        
        this.props.onChange(Math.round(progress));
    }
}

export default ProgressBar;

export class Test extends ProgressBar {
    constructor(props) {
        super(props)
    }

    render() {
        const {progress} = this.props
        const { seek } = this.state

        return (
        <div className={ 'mpl4v-volume-panel' }>
            <i class="zmdi zmdi-minus mpl4v-volume-down"></i>
            <div 
                className={ `mpl4v-volume-bar ${ seek ? "mpl4v-playback-progressbar--seek" : ''}` }
                onMouseDown={ this.startSeek }
                ref={ this.barEltRef }
            >
                <Bar classes={ 'mpl4v-bar-progress-color' } progress={ progress }/>
            </div>
            <i class="zmdi zmdi-plus mpl4v-volume-up"></i>
        </div>
        )
    }
}