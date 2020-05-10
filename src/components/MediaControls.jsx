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
                <i className="zmdi zmdi-play"></i>
                <i className="zmdi zmdi-skip-next"></i>
                {/* <i className="zmdi zmdi-shuffle"></i> */}
            </div>
            <TimeLabel time={12345} duration={44444}/>
            <div className="mpl4v-fl-row mpl4-controls--right">
                {/* <i className="zmdi zmdi-volume-up mpl4v-vol-ctrl"></i> */}
                <Volume 
                    volume={ volume } onChange={ onVolumeChange }
                    muted={ props.muted } toogleMute={ props.toogleMute }
                />
                <ScreenButton {...props} />
                {/* <i className="zmdi zmdi-settings"></i> */}
                <i className="zmdi zmdi-download"></i>
            </div>
        </div>
    </div>
    )
}