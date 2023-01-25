import React from "react";
import Dragger from "./utils/Dragger";
import MediaControls from './player/component/MediaControls';
import MouseStopWatcher from './utils/MouseStopWatcher';
import { PageParser } from "./PageParser";
import { Track } from "./player/model/Track";
import HotkeysController from "./utils/HotkeysController";
import downloadCrunch from "./utils/download";
import { PlayerModel } from "./player/model/PlayerModel";
import { DropMedia } from "./drop-media";
import { action, reaction } from "mobx";
import { ScreenModel } from "./player/model/ScreenModel";
import { Observer } from "mobx-react-lite";
import Screen from "./player/component/Screen"
import Playlist from "./player/model/Playlist";

// eslint-disable-next-line mobx/missing-observer
export class App extends React.Component {

    // TODO ui to change this setting
    autoplayDroppedURL = true;

    // TODO move to ScreenModel ?
    delayBeforeHideControls = 2000;

    constructor(props) {
        super(props);

        this.mediaRef = React.createRef();

        this.mouseStop = new MouseStopWatcher(this.delayBeforeHideControls);
        this.mouseStop.onMouseStop = action(() => this.screenModel.showControls = false)
        this.mouseStop.onMouseStart = action(() => this.screenModel.showControls = true)

        let tracks = new PageParser().getTracks().map(({ src, elt}) => new Track(src, elt))

        this.playerModel = new PlayerModel();
        this.playerModel.playlist.setPlaylist(tracks)

        this.screenModel = new ScreenModel()

        Screen.toggleFullscreen = () => this.screenModel.toggleFullscreen(this.appRef.current)

        reaction(() => this.screenModel.inFullscreen, (fs) => {
            if (fs) {
                this.dragger?.disable()
                this.mouseStop.enable()
            } else {
                this.dragger?.enable()
                this.mouseStop.disable()
            }
        }, { fireImmediately: true })

        this.dropMedia = new DropMedia(React.createRef())
        this.dropMedia.onNewURLDropped = this.onNewMediaDropped
        this.appRef = this.dropMedia.dropTargetRef;

        reaction(() => this.dropMedia.droppedMediaURL, this.onMediaDropped, { fireImmediately: true })
    }

    onMediaDropped = url => {
        if (url && this.playerModel.track.mediaURI != url) {

            // find track by url
            let index = this.playerModel.playlist.findTrackIndex(url)
            let track;

            // for some reason dropped media is not in the playlist
            if (index === -1) {
                track = new Track(url, this.dropMedia.draggedElt)

                index = this.playerModel.playlist.currentTrackIndex + 1

                // NOTE track insertion can be ommited if
                // the track doesnt wanted in the playlist,
                // but still the track can be set as current.
                // TODO current track should be PLayerModel property.
                this.playerModel.playlist.list.splice(index, 0, track)
            } else {
                track = this.playerModel.playlist.getTrack(index)
            }

            // set the track as current
            this.playerModel.playlist.setTrackAsCurrent(track, index)

            // play the track if player was in play state
            // or if autoplay is true
            // TODO need a some user setting for this
            if (this.autoplayDroppedURL) {
                this.playerModel.play()
            }
        }
    }

    componentDidMount() {
        const appElt = this.appRef.current;
        this.dragger = new Dragger(appElt, ['.mpl4v-drag-initiator'], appElt);
        this.dragger.enable();

        // NOTE not enabling mousestop until controls component
        // enable it allows to show controls as long as user
        // does not move mous over controls.
        // this.mouseStop.enable()

        this.playerModel.setPlayerElt(this.mediaRef.current);

        this.initHotkeys();
    }

    initHotkeys() {
        this.hotkeys = new HotkeysController(this.appRef.current);
        this.hotkeys.addCombo({ key: "P", action: this.playerModel.togglePause });
        this.hotkeys.addCombo({ code: "KeyP", action: this.playerModel.togglePause });
        this.hotkeys.addCombo({ shiftKey: true, key: " ", action: this.playerModel.togglePause, preventDefault: true });
        this.hotkeys.addCombo({ code: "KeyM", action: this.playerModel.toggleMute });
        this.hotkeys.addCombo({ code: "Period", action: this.playerModel.increaseSpeed }); // >
        this.hotkeys.addCombo({ code: "Comma", action: this.playerModel.decreaseSpeed }); // <
        this.hotkeys.addCombo({ code: "KeyL", action: this.playerModel.toggleLoopState });
        this.hotkeys.addCombo({ shiftKey: true, key: "ArrowLeft", action: this.playerModel.playPrevent, preventDefault: true });
        this.hotkeys.addCombo({ shiftKey: true, key: "ArrowRight", action: this.playerModel.playNext, preventDefault: true });
        this.hotkeys.addCombo({ code: "KeyD", action: this.downloadTrack });
        this.hotkeys.addCombo({ shiftKey: true, key: "ArrowDown", action: this.downloadTrack, preventDefault: true });
        this.hotkeys.addCombo({ code: "KeyF", action: () => this.screenModel.toggleFullscreen(this.appRef.current) });
        this.hotkeys.enable();
    }

    downloadTrack = () => {
        const track = this.playerModel.track
        if (track && track.mediaURI)
            downloadCrunch(track.mediaURI, track.title || "");
    };

    render() {
        // <Observer> allows to use mobx with class components
        return <Observer>{ this.renderApp }</Observer>
    }

    renderApp = () => {

        return (
            <div className={"mpl4v"}
                ref={this.appRef}
                style={{ position: "fixed", right: "50px", bottom: "50px" }}
                data-fullscreen={this.screenModel.inFullscreen}
                tabIndex="0"
            >
                <Screen
                    toogleFullscreen={Screen.toggleFullscreen}
                    mediaRef={this.mediaRef}
                    videoEltRef={this.mediaRef}
                    hudFocusIn={this.mouseStop.disable}
                    hudFocusOut={this.mouseStop.enable}
                    playerModel={this.playerModel}
                    screenModel={this.screenModel}
                />
                <MediaControls
                    hideControls={!this.screenModel.showControls}
                    focusIn={this.mouseStop.disable}
                    focusOut={this.mouseStop.enable}
                    playerModel={this.playerModel}
                    screenModel={this.screenModel} />
            </div>
        );
    }
}
