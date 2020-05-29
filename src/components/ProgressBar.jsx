import React, { PureComponent } from 'react'
import ProgressCalculator from '../utils/ProgressCalculator';
import PropTypes from 'prop-types'
import { bound } from '../utils/utils';

/**
 * Basic code to control progress bar.
 * Component does not have render(), you should implement
 * it in a subclass.
 * 
 * Properties:
 *  enabled:bool - wether or not bar is enabled
 *  onChange:func is required - callback to dispatch progress changing,
 *              the value will be in range [0, 100]
 *  isHorizontal:bool - direction(horizontal or vertical), default is true
 * 
 * State:
 *  seek:bool - shows wether the component in seek mode (controlled by user)
 *  
 * Refs:
 *  barEltRef - refers to an element that is progressbar, 
 *              the element's width(or height) is used to calculate progress
 */
export function barController(RealBar) {
/**
    Progress bar returns progress in percents [0-100].
    Parent component should convert this value by itself.
    Bar can be disabled/inactive (e.g. when there is no video)

*/
return class BarController extends PureComponent {
    
    static propTypes = {
        enabled: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        isHorizontal: PropTypes.bool,
        onSeekEnd: PropTypes.func,
        onSeekStart: PropTypes.func,
    }

    static defaultProps = {
        enabled: true,
        isHorizontal: true,
    }

    constructor(props) {
        super(props)

        this.state = {
            seek: false,
        }

        this.calculator = new ProgressCalculator()
        this.barEltRef = React.createRef()
        this.progress = 0
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.enabled != prevProps.enabled) {
            const enabled = this.props.enabled
            if (!enabled) 
                this.stopSeek()
        }
    }

    startSeek = event => {
        // dont start seeking if 
        // it is not main (left) mouse button pressed
        if (event.button != 0)  return
        // this should deisable text selection
        event.preventDefault()
        // I dont want this event to be heared
        // outside this component
        event.stopPropagation(); 

        this.setState({ seek: true })

        this.calculator.init(event.nativeEvent, this.barEltRef.current, this.props.isHorizontal);
        this.calculateProgress()

        // lift progress value up
        this.props.onChange(this.progress);

        if (this.props.onSeekStart)
            this.props.onSeekStart(this.progress)

        // enable control
        document.addEventListener('mouseup', this.stopSeek);
        document.addEventListener('mousemove', this.seek);
    }
    
    stopSeek = () => {
        document.removeEventListener('mouseup', this.stopSeek);
        document.removeEventListener('mousemove', this.seek);

        this.setState({ seek: false })

        if (this.props.onSeekEnd)
            this.props.onSeekEnd(this.progress)
    }

    seek = event => {
        this.calculator.update(event);
        this.calculateProgress()
        // lift progress value up
        this.props.onChange(this.progress);
    }
    
    calculateProgress = () => this.progress = bound(this.calculator.getProgress(), 0, 100)

    render() {
        const { onChange, onSeekStart, onSeekEnd, enabled, ...passedProps} = this.props
        const { seek } = this.state
        
        return (
        <RealBar 
            seek={ seek }
            enabled={ enabled }
            startSeek={ enabled ? this.startSeek : undefined }
            barEltRef={ this.barEltRef }
            {...passedProps}
        />
        )
    }
};
        
}

const ProgressBar = {}
export default ProgressBar;

function Head(props) {
    const { progress, classes } = props
    const headStyle = {
        left: `${ progress }%`
        // Below is a way to contain the head only
        // inside the bar, but I must know head's size.
        // marginLeft: `-${Math.round(progress*0.1)}px`
    }
    return (
        <div style={ headStyle } className={ `${classes}` }></div>
    )
}

Head.propTypes = {
    progress: PropTypes.number.isRequired,
    classes: PropTypes.string.isRequired,
}

ProgressBar.Head = React.memo(Head)