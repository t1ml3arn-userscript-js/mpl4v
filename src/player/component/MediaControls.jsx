import React from 'react'
import TimeLabel from './TimeLabel'
import VolumePanel from "./VolumePanel";
import Button from './buttons'
import { focusNotifier } from "../../components/focus-notifier";
import { observer } from 'mobx-react-lite';
import { PlayerModel } from '../model/PlayerModel';
import { ScreenModel } from '../model/ScreenModel';
import PlaybackProgressBar from './PlaybackProgress';

let MediaControls = observer(props => {
    /** @type {{playerModel: PlayerModel, screenModel: ScreenModel }} */
    const { playerModel, screenModel } = props

    const { hideControls } = props
    const fade = hideControls ? "mpl4v-trans--fade-out" : "mpl4v-trans--fade-in"

    return (
    <div 
        className={ `mpl4v-controls ${fade}` } 
        data-fullscreen={ screenModel.inFullscreen }
    >
        <PlaybackProgressBar
            // TODO use playerElement.seekable to enable/disable ability to seek ?
            enabled={ Boolean(playerModel.duration) }
            progress={ playerModel.playbackProgress } 
            onChange={ playerModel.setPlaybackProgress } 
            bufferedProgress={ playerModel.bufferedProgress }
            onSeekStart={ playerModel.startSeek }
            onSeekEnd={ playerModel.endSeek }
        />
        <div className={`mpl4v-control-btns ${ screenModel.inFullscreen ? '' : 'mpl4v-drag-initiator' }`}>
            <div className="mpl4v-fl-row mpl4-controls--left ">
                <Button.Loop looped={ playerModel.loop } toogleLoop={ playerModel.toggleLoopState }/>
                <Button.Skip isNext={ false } onClick={ playerModel.playPrevent }/>
                <Button.Play 
                    tooglePlayPause={ playerModel.togglePause } 
                    isPlaying={ playerModel.isPlaying }
                    isBuffering={ playerModel.isBuffering } />
                <Button.Skip isNext={ true } onClick={ playerModel.playNext }/>
                {/* <i className="zmdi zmdi-shuffle"></i> */}
            </div>
            <TimeLabel time={ playerModel.currentTime } duration={ playerModel.duration }/>
            <div className="mpl4v-fl-row mpl4-controls--right">
                <VolumePanel
                    volume={ playerModel.volume } 
                    muted={ playerModel.muted } toogleMute={ playerModel.toggleMute }
                    onChange={ playerModel.updateVolume } onVolumeChange={ playerModel.updateVolume }
                    hasAudio={ playerModel.hasAudio }
                    hidden={ !playerModel.hasAudio || playerModel.seekByUser }
                />
                <Button.Screen
                    showScreen={ screenModel.showScreen }
                    toogleScreen={ screenModel.inFullscreen ? screenModel.exitFullscreen : screenModel.toggleShowScreenState }
                    fullscreen={ screenModel.inFullscreen }
                />
                {/* <i className="zmdi zmdi-settings"></i> */}
                <Button.Download 
                    downloadURL={ playerModel.mediaSrc } 
                    saveAs={ playerModel.track?.title } /> 
            </div>
        </div>
    </div>
    )
})

MediaControls = React.memo(focusNotifier(MediaControls))

export default MediaControls;