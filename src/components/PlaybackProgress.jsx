import React from "react";
import PropTypes from 'prop-types'
import Bar from "./Bar";
import ProgressBar, { barController } from './ProgressBar'
import { RefType } from "../utils/utils";

function PlaybackProgressView(props) {

    const { progress, bufferedProgress } = props;
    const { barEltRef, startSeek, seek } = props

    return (
    <div 
        className={ `mpl4v-playback-progressbar ${ seek ? "mpl4v-playback-progressbar--seek" : ''}` }
        ref={ barEltRef }
        onMouseDown={ startSeek }
    >
        <div className={ "mpl4v-playback-progressbar__underlay" }/>
        <Bar classes={ "mpl4v-bar-buff-color"} progress={ bufferedProgress }/>
        <Bar classes={ "mpl4v-bar-seek-color"} progress={ 60 }/>
        <Bar classes={ "mpl4v-bar-progress-color"} progress={ progress }/>
        <ProgressBar.Head classes={ "mpl4v-playback-progressbar__head" } progress={ progress }/>
    </div>
    )
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