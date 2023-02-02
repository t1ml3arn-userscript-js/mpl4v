import fscreen from 'fscreen';
import { action, computed, makeObservable, observable } from "mobx";
import RootStore from '../../root-store';

export class ScreenModel {

	// targetRef;
	// get targetElement() { return this.targetRef?.current }
	// get isTargetInFullscreen() { return this.inFullscreen && this.fullscreenElement === this.targetElement; }

	/** This flag is true only when this app is in fullscreen */
	inFullscreen = false;
	showScreen = true;
	showControls = true;

	fullscreenElement = null;

	get isFullscreenSupported() { return fscreen.fullscreenEnabled; }

	/** @type {RootStore} */
	rootStore;

	get position() { return this.rootStore.settings.current.appearance.position }

	constructor(rootStore) {
		makeObservable(this, {
			// targetRef: true,
			// targetElement: computed,
			inFullscreen: observable,
			showScreen: observable,
			showControls: observable,
			position: computed,
			fullscreenElement: false,
			handleFullscreenChange: action,
			toggleShowScreenState: action,
			isFullscreenSupported: false,
			requestFullscreen: false,
			rootStore: false,
		});

		this.rootStore = rootStore

		if (this.isFullscreenSupported) {
			fscreen.addEventListener('fullscreenchange', this.handleFullscreenChange);
		}
	}

	handleFullscreenChange = () => {
		this.inFullscreen = Boolean(fscreen.fullscreenElement) && (fscreen.fullscreenElement === this.fullscreenElement)
		this.fullscreenElement = fscreen.fullscreenElement
	}

	requestFullscreen = (elt) => {
		this.fullscreenElement = elt
		fscreen.requestFullscreen(elt)
	}

	exitFullscreen = () => fscreen.exitFullscreen();
	toggleFullscreen = (elt) => this.inFullscreen ? this.exitFullscreen() : this.requestFullscreen(elt)

	toggleShowScreenState = () => this.showScreen = !this.showScreen
}
