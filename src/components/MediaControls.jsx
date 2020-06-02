import React from 'react'
import PlaybackProgressBar from './PlaybackProgress'
import TimeLabel from './TimeLabel'
import VolumePanel from "./VolumePanel";
import Button from './Button'
import { focusNotifier } from "./focusNotifierHOC";

let MediaControls = props => {
    const { fullscreen } = props
    const dragInitier = fullscreen ? '' : "mpl4v-drag-initiator"
    const { progress, bufferedProgress, onProgressChange } = props
    const { currentTime, duration } = props
    const { volume, onVolumeChange } = props
    const { hideControls } = props
    const fade = hideControls ? "mpl4v-trans--fade-out" : "mpl4v-trans--fade-in"

    return (
    <div 
        className={ `mpl4v-controls ${fade}` } 
        data-fullscreen={ fullscreen }
    >
        <PlaybackProgressBar 
            progress={ progress } 
            onChange={ onProgressChange } 
            bufferedProgress={ bufferedProgress }
            onSeekEnd={ props.onSeekEnd }
            onSeekStart={ props.onSeekStart }
            enabled={ props.canChangeTime }
        />
        <div className={`mpl4v-control-btns ${ dragInitier }`}>
            <div className="mpl4v-fl-row mpl4-controls--left ">
                <Button.Loop looped={ props.looped } toogleLoop={ props.toogleLoop }/>
                <Button.Skip isNext={ false } onClick={ props.playPrevent }/>
                <Button.Play 
                    tooglePlayPause={ props.tooglePlayPause } 
                    isPlaying={ props.isPlaying }
                    isBuffering={ props.isBuffering }
                />
                <Button.Skip isNext={ true } onClick={ props.playNext }/>
                {/* <i className="zmdi zmdi-shuffle"></i> */}
            </div>
            <TimeLabel time={ currentTime } duration={ duration }/>
            <div className="mpl4v-fl-row mpl4-controls--right">
                <VolumePanel
                    volume={ volume } onChange={ onVolumeChange } onVolumeChange={ onVolumeChange }
                    muted={ props.muted } toogleMute={ props.toogleMute }
                    seekByUser={ props.seekByUser } hasAudio={ props.hasAudio }
                />
                <Button.Screen
                    showScreen={ props.showScreen }
                    toogleScreen={ props.toogleScreen }
                    fullscreen={ props.fullscreen }
                />
                {/* <i className="zmdi zmdi-settings"></i> */}
                <Button.Download downloadURL={ props.downloadURL } saveAs={ props.saveAs }/> 
            </div>
        </div>
    </div>
    )
}

MediaControls = React.memo(focusNotifier(MediaControls))

export default MediaControls;