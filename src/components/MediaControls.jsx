import React from 'react'
import PlaybackProgress from './Progress'
import TimeLabel from './TimeLabel'
import ScreenButton from './ScreenButton'
import Volume from "./VolumeBar";

export default function MediaControls(props) {
    const { fullscreen } = props
    const dragInitier = fullscreen ? '' : "mpl4v-drag-initiator"
    const { progress, onProgressChange } = props
    
    return (
    <div class="mpl4v-controls" data-fullscreen={ fullscreen }>
        <PlaybackProgress progress={ progress } onChange={ onProgressChange } />
        <div className={`mpl4v-control-btns ${ dragInitier }`}>
            <div class="mpl4v-fl-row mpl4-controls--left ">
                <i class="zmdi zmdi-repeat"></i>
                <i class="zmdi zmdi-skip-previous"></i>
                <i class="zmdi zmdi-play"></i>
                <i class="zmdi zmdi-skip-next"></i>
                {/* <i class="zmdi zmdi-shuffle"></i> */}
            </div>
            <TimeLabel time={12345} duration={44444}/>
            <div class="mpl4v-fl-row mpl4-controls--right">
                <i class="zmdi zmdi-volume-up mpl4v-vol-ctrl"></i>
                <ScreenButton {...props} />
                {/* <i class="zmdi zmdi-settings"></i> */}
                <i class="zmdi zmdi-download"></i>
            </div>
        </div>
        <Volume volume={ 0.5 } onChange={ () => 0 }/>
    </div>
    )
}