import React from 'react'
import ProgressCalculator from '../utils/ProgressCalculator';
import PropTypes from 'prop-types'

/**
 * Basic code to control progress bar.
 * Component does not have render(), you should implement
 * it in a subclass.
 * 
 * Properties:
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
export default class ProgressBar extends React.Component {
    static propTypes = {
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
        // dont start seeking if 
        // it is not main (left) mouse button pressed
        if (event.button != 0)  return
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
    
    stopSeek = () => {
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

ProgressBar.Head = function Head(props) {
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

ProgressBar.Head.propTypes = {
    progress: PropTypes.number.isRequired,
    classes: PropTypes.string.isRequired,
}

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
return class BarController extends React.Component {
    
    static propTypes = {
        enabled: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        isHorizontal: PropTypes.bool,
    }

    static defaultProps = {
        isHorizontal: true,
    }

    constructor(props) {
        super(props)

        this.state = {
            seek: false,
            enabled: true || props.enabled,
        }

        this.calculator = new ProgressCalculator()
        this.barEltRef = React.createRef()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.enabled != prevState.enabled) {
            const enabled = this.props.enabled
            this.setState({ enabled: enabled })
            if (!enabled) this.stopSeek()
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
    
    stopSeek = () => {
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

    render() {
        const { onChange, ...passedProps} = this.props
        const { seek, enabled } = this.state
        
        return (
        <RealBar 
            seek={ seek }
            enabled={ enabled }
            startSeek={ this.startSeek }
            barEltRef={ this.barEltRef }
            {...passedProps}
        />
        )
    }
};
        
}
    
// export const ProgressBar = {}
    