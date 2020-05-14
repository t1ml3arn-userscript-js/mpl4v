import React from "react";
import PropTypes from 'prop-types'
import Bar from "./Bar";
import ProgressBar, { barController } from './ProgressBar'
import { RefType, bound } from "../utils/utils";
import ProgressCalculator from "../utils/ProgressCalculator";

class PlaybackProgressView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.calculator = new ProgressCalculator()
    }
    
    getSeekProgress() {
        return bound(this.calculator.getProgress(), 0, 100)
    }

    showSeekBar = e => {
        this.calculator.init(e, this.props.barEltRef.current, true)        
        this.setState({ seekProgress: this.getSeekProgress() })
    }
    
    updateSeekBar = e => {
        this.calculator.update(e)
        this.setState({ seekProgress: this.getSeekProgress() })
    }

    render() {
        const props = this.props
        const { progress, bufferedProgress } = props;
        const { barEltRef, startSeek, seek } = props
        const nonSeekTransitionClass = seek ? "" : " mpl4v-bar--transition-hor"
        const seekProgress = this.state.seekProgress || 0

        return (
        <div 
            className={ `mpl4v-playback-progressbar ${ seek ? "mpl4v-playback-progressbar--seek" : ''}` }
            ref={ barEltRef }
            onMouseDown={ startSeek }
            onMouseOver={ this.showSeekBar }
            onMouseMove={ this.updateSeekBar }
        >
            <div className={ "mpl4v-playback-progressbar__underlay" }/>
            <Bar classes={ "mpl4v-bar-buff-color mpl4v-bar--transition-hor"} progress={ bufferedProgress }/>
            <Bar classes={ "mpl4v-bar-seek-color mpl4v-seekbar"} progress={ seekProgress }/>
            <Bar classes={ `mpl4v-bar-progress-color ${nonSeekTransitionClass}`} progress={ progress }/>
            <ProgressBar.Head classes={ `mpl4v-playback-progressbar__head` } progress={ progress }/>
        </div>
        )
    }
}

PlaybackProgressView.propTypes = {
    progress: PropTypes.number.isRequired,
    bufferedProgress: PropTypes.number.isRequired,
    startSeek: PropTypes.func.isRequired,
    seek: PropTypes.bool.isRequired,
    barEltRef: RefType.isRequired,
}

const PlaybackProgressBar = barController(PlaybackProgressView)
export default PlaybackProgressBar