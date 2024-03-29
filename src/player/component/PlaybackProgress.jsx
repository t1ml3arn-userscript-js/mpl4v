import React from "react";
import PropTypes from 'prop-types'
import Progress from "../../components/progress-bar";
import { barController } from '../../components/progress-bar-controller'
import { RefType, clamp } from "../../utils/utils";
import ProgressCalculator from "../../utils/ProgressCalculator";

class PlaybackProgressView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.calculator = new ProgressCalculator()
    }
    
    getSeekProgress() {
        return clamp(this.calculator.getProgress(), 0, 100)
    }

    showSeekBar = e => {
        this.calculator.init(e, this.props.barEltRef.current, true)        
        this.setState({ seekPosition: this.getSeekProgress() })
    }
    
    updateSeekBar = e => {
        this.calculator.update(e)
        this.setState({ seekPosition: this.getSeekProgress() })
    }

    render() {
        const props = this.props
        const { progress, bufferedProgress } = props;
        const { barEltRef, startSeek, seek } = props
        const transitionClass = seek ? "" : " mpl4v-bar--transition-hor"
        const seekPosition = seek ? 0 : (this.state.seekPosition || 0)
        
        return (
        <div 
            className={ `mpl4v-playback-progressbar ${ seek ? "mpl4v-playback-progressbar--seek" : ''}` }
            ref={ barEltRef }
            onMouseDown={ startSeek }
            onMouseOver={ this.showSeekBar }
            onMouseMove={ this.updateSeekBar }
        >
            <div className={ "mpl4v-playback-progressbar__underlay" }/>
            <Progress.Bar classes={ "mpl4v-bar-buff-color mpl4v-bar--transition-hor"} progress={ bufferedProgress }/>
            <Progress.Bar classes={ "mpl4v-bar-seek-color mpl4v-seekbar"} progress={ seekPosition }/>
            <Progress.Bar classes={ `mpl4v-bar-progress-color ${transitionClass}`} progress={ progress }/>
            <Progress.Head classes={ `mpl4v-playback-progressbar__head` } progress={ progress }/>
        </div>
        )
    }
}

PlaybackProgressView.propTypes = {
    progress: PropTypes.number.isRequired,
    bufferedProgress: PropTypes.number.isRequired,
    startSeek: PropTypes.func,
    seek: PropTypes.bool.isRequired,
    barEltRef: RefType.isRequired,
}

const PlaybackProgressBar = barController(PlaybackProgressView)
export default PlaybackProgressBar