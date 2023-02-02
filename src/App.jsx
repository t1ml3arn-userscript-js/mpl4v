import React from "react";
import Dragger from "./utils/Dragger";
import MediaControls from './player/component/MediaControls';
import MouseStopWatcher from './utils/MouseStopWatcher';
import { PageParser } from "./PageParser";
import { Track } from "./player/model/Track";
import HotkeysController from "./utils/HotkeysController";
import downloadCrunch from "./utils/download";
import { DropMedia } from "./drop-media";
import { action, reaction } from "mobx";
import { Observer } from "mobx-react-lite";
import Screen from "./player/component/Screen"
import RootStore, { StoreContext } from "./root-store";

// eslint-disable-next-line mobx/missing-observer
export class App extends React.Component {

    // TODO ui to change this setting
    autoplayDroppedURL = true;

    // TODO move to ScreenModel ?
    delayBeforeHideControls = 2000;

    constructor(props) {
        super(props);

        /** @type {{store: RootStore}} */
        const { store } = props

        this.store = store

        this.mediaRef = React.createRef();

        this.mouseStop = new MouseStopWatcher(this.delayBeforeHideControls);
        this.mouseStop.onMouseStop = action(() => this.store.appearance.showControls = false)
        this.mouseStop.onMouseStart = action(() => this.store.appearance.showControls = true)

        let tracks = new PageParser().getTracks().map(({ src, elt}) => new Track(src, elt))

        this.store.player.playlist.setPlaylist(tracks)

        Screen.toggleFullscreen = () => this.store.appearance.toggleFullscreen(this.appRef.current)

        reaction(() => this.store.appearance.inFullscreen, (fs) => {
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
        if (url && this.store.player.track.mediaURI != url) {

            // find track by url
            let index = this.store.player.playlist.findTrackIndex(url)
            let track;

            // for some reason dropped media is not in the playlist
            if (index === -1) {
                track = new Track(url, this.dropMedia.draggedElt)

                index = this.store.player.playlist.currentTrackIndex + 1

                // NOTE track insertion can be ommited if
                // the track is not wanted in the playlist,
                // but still the track can be set as current.
                // TODO current track should be PLayerModel property.
                this.store.player.playlist.list.splice(index, 0, track)
            } else {
                track = this.store.player.playlist.getTrack(index)
            }

            // set the track as current
            this.store.player.playlist.setTrackAsCurrent(track, index)

            // play the track if player was in play state
            // or if autoplay is true
            // TODO need a some user setting for this
            if (this.autoplayDroppedURL) {
                this.store.player.play()
            }
        }
    }

    componentDidMount() {
        const appElt = this.appRef.current;
        this.dragger = new Dragger(appElt, ['.mpl4v-drag-initiator'], appElt);
        this.dragger.enable();
        this.dragger.endDragSignal.connect(event => {
            const target = event.dragger.target
            const { left, top, right, bottom } = target.style
            const position = { left, top, right, bottom }

            this.store.settings.update({
                appearance: {
                    id: 'user',
                    position
                }
            }, true)
        })

        // NOTE not enabling mousestop until controls component
        // enable it allows to show controls as long as user
        // does not move mous over controls.
        // this.mouseStop.enable()

        this.store.player.setPlayerElt(this.mediaRef.current);

        // restore saved position
        const { left, top, right, bottom } = this.store.appearance.position
        appElt.style.left = left
        appElt.style.top = top
        appElt.style.right = right
        appElt.style.bottom = bottom
        
        this.initHotkeys();
    }

    initHotkeys() {
        this.hotkeys = new HotkeysController(this.appRef.current);
        this.hotkeys.addCombo({ key: "P", action: this.store.player.togglePause });
        this.hotkeys.addCombo({ code: "KeyP", action: this.store.player.togglePause });
        this.hotkeys.addCombo({ shiftKey: true, key: " ", action: this.store.player.togglePause, preventDefault: true });
        this.hotkeys.addCombo({ code: "KeyM", action: this.store.player.toggleMute });
        this.hotkeys.addCombo({ code: "Period", action: this.store.player.increaseSpeed }); // >
        this.hotkeys.addCombo({ code: "Comma", action: this.store.player.decreaseSpeed }); // <
        this.hotkeys.addCombo({ code: "KeyL", action: this.store.player.toggleLoopState });
        this.hotkeys.addCombo({ shiftKey: true, key: "ArrowLeft", action: this.store.player.playPrevent, preventDefault: true });
        this.hotkeys.addCombo({ shiftKey: true, key: "ArrowRight", action: this.store.player.playNext, preventDefault: true });
        this.hotkeys.addCombo({ code: "KeyD", action: this.downloadTrack });
        this.hotkeys.addCombo({ shiftKey: true, key: "ArrowDown", action: this.downloadTrack, preventDefault: true });
        this.hotkeys.addCombo({ code: "KeyF", action: () => this.store.appearance.toggleFullscreen(this.appRef.current) });
        this.hotkeys.enable();
    }

    downloadTrack = () => {
        const track = this.store.player.track
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
                style={{ 
                    position: "fixed", 
                    ...this.store.appearance.position
                }}
                data-fullscreen={this.store.appearance.inFullscreen}
                tabIndex="0"
            >
                <Screen
                    toogleFullscreen={Screen.toggleFullscreen}
                    mediaRef={this.mediaRef}
                    videoEltRef={this.mediaRef}
                    hudFocusIn={this.mouseStop.disable}
                    hudFocusOut={this.mouseStop.enable}
                />
                <MediaControls
                    focusIn={this.mouseStop.disable}
                    focusOut={this.mouseStop.enable} />
            </div>
        );
    }
}

App.contextType = StoreContext