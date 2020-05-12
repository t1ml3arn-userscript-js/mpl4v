import React from 'react'
import PlaybackProgress from './PlaybackProgress'
import TimeLabel from './TimeLabel'
import ScreenButton from './ScreenButton'
import Volume from "./VolumeBar";
import Button from './Button'

export default function MediaControls(props) {
    const { fullscreen } = props
    const dragInitier = fullscreen ? '' : "mpl4v-drag-initiator"
    const { progress, onProgressChange } = props
    const { volume, onVolumeChange } = props
    
    return (
    <div className="mpl4v-controls" data-fullscreen={ fullscreen }>
        <PlaybackProgress progress={ progress } onChange={ onProgressChange } />
        <div className={`mpl4v-control-btns ${ dragInitier }`}>
            <div className="mpl4v-fl-row mpl4-controls--left ">
                <Button.Loop looped={ props.looped } toogleLoop={ props.toogleLoop }/>
                <i className="zmdi zmdi-skip-previous"></i>
                <Button.Play tooglePlayPause={ props.tooglePlayPause } isPlaying={ props.isPlaying }/>
                <i className="zmdi zmdi-skip-next"></i>
                {/* <i className="zmdi zmdi-shuffle"></i> */}
            </div>
            <TimeLabel time={12345} duration={44444}/>
            <div className="mpl4v-fl-row mpl4-controls--right">
                <Volume 
                    volume={ volume } onChange={ onVolumeChange }
                    muted={ props.muted } toogleMute={ props.toogleMute }
                />
                <ScreenButton
                    showScreen={ props.showScreen }
                    toogleScreen={ props.toogleScreen }
                    fullscreen={ props.fullscreen }
                />
                {/* <i className="zmdi zmdi-settings"></i> */}
                <i className="zmdi zmdi-download"></i>
            </div>
        </div>
    </div>
    )
}