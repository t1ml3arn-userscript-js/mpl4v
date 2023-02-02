import React, { useContext } from 'react'
import TimeLabel from './TimeLabel'
import VolumePanel from "./VolumePanel";
import Button from './buttons'
import { focusNotifier } from "../../components/focus-notifier";
import { observer } from 'mobx-react-lite';
import PlaybackProgressBar from './PlaybackProgress';
import RootStore, { StoreContext } from '../../root-store';

let MediaControls = observer(() => {

    /** @type {RootStore} */
    const store = useContext(StoreContext)
    const player = store.player
    const appearance = store.appearance

    const fade = !appearance.showControls ? "mpl4v-trans--fade-out" : "mpl4v-trans--fade-in"

    return (
    <div 
        className={ `mpl4v-controls ${fade}` } 
        data-fullscreen={ appearance.inFullscreen }
    >
        <PlaybackProgressBar
            // TODO use playerElement.seekable to enable/disable ability to seek ?
            enabled={ Boolean(player.duration) }
            progress={ player.playbackProgress } 
            onChange={ player.setPlaybackProgress } 
            bufferedProgress={ player.bufferedProgress }
            onSeekStart={ player.startSeek }
            onSeekEnd={ player.endSeek }
        />
        <div className={`mpl4v-control-btns ${ appearance.inFullscreen ? '' : 'mpl4v-drag-initiator' }`}>
            <div className="mpl4v-fl-row mpl4-controls--left ">
                <Button.Loop looped={ player.loop } toogleLoop={ player.toggleLoopState }/>
                <Button.Skip isNext={ false } onClick={ player.playPrevent }/>
                <Button.Play 
                    tooglePlayPause={ player.togglePause } 
                    isPlaying={ player.isPlaying }
                    isBuffering={ player.isBuffering } />
                <Button.Skip isNext={ true } onClick={ player.playNext }/>
                {/* <i className="zmdi zmdi-shuffle"></i> */}
            </div>
            <TimeLabel time={ player.currentTime } duration={ player.duration }/>
            <div className="mpl4v-fl-row mpl4-controls--right">
                <VolumePanel
                    volume={ player.volume } 
                    muted={ player.muted } toogleMute={ player.toggleMute }
                    onChange={ player.updateVolume } onVolumeChange={ player.updateVolume }
                    hasAudio={ player.hasAudio }
                    hidden={ !player.hasAudio || player.seekByUser }
                />
                <Button.Screen
                    showScreen={ appearance.showScreen }
                    toogleScreen={ appearance.inFullscreen ? appearance.exitFullscreen : appearance.toggleShowScreenState }
                    fullscreen={ appearance.inFullscreen }
                />
                {/* <i className="zmdi zmdi-settings"></i> */}
                <Button.Download 
                    downloadURL={ player.mediaSrc } 
                    saveAs={ player.track?.title } /> 
            </div>
        </div>
    </div>
    )
})

// TODO unwrap from memo ?
MediaControls = React.memo(focusNotifier(MediaControls))

export default MediaControls;