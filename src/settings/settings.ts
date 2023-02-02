// /* eslint-disable no-undef */
// const GM = window.GM ?? {
//     isAsync: false,
//     info: GM_info,
//     setValue: GM_setValue,
//     getValue: GM_getValue
// };
// /* eslint-disable no-undef */

import { makeObservable, observable, runInAction } from "mobx";

// if (GM.isAsync) {
//     GM.getValue(SETTINGS_KEY, settings)
//         .then(data => settings = data)
// } else {
//     settings = GM.getValue(SETTINGS_KEY, settings)
// }

export default class Settings {

	static readonly KEY = 'mpl4v-settings'

	static readonly DEFAULT = {
		version: '1.2.3',
		playback: {
			muted: false,
			looped: true,
			volume: 0.5,
			playbackRate: 1,
			rateStep: 0.25,
			autoplayDroppedURL: true,
			exclude: [
				'len<15'
			]
		},
		appearance: {
			id: 'default',
			position: {
				left: null,
				top: null,
				right: '50px',
				bottom: '50px',
			},
			scale: {
				[1]: 1,
				[4 / 3]: 1,
				[5 / 4]: 1
			},
			showScreen: true,
			useDefaultControls: false,
			showFullscreenButton: false,
			showDownloadButton: true,
			showFoldScreenButton: true,
			delayBeforeHideControls_ms: 3000,
		}
	}

	current: typeof Settings.DEFAULT;

	get version():string {
		return process.env.APP_VERSION;
	}

	constructor() {
		
		makeObservable(this, {
			current: observable
		})
		// GM is available ONLY in userscript context (obviously)
		// I have to make dev pipeline with dev
		// console.log('GM', window.GM, GM);
	}

	load() {
		const settings = Object.assign({}, Settings.DEFAULT, { version: this.version })
		const raw = localStorage.getItem(Settings.KEY)
		return Promise.resolve(raw ? JSON.parse(raw) : settings)
			.then(data => {
				runInAction(() => {
					this.current = data
				})
			})
	}

	update(data:Partial<typeof Settings.DEFAULT>, save:boolean = false) {
		// TODO steal more smart partial ?
		// https://stackoverflow.com/questions/61132262/typescript-deep-partial#answer-74804708
		// https://stackoverflow.com/questions/39713349/make-all-properties-within-a-typescript-interface-optional#answer-40076355
		this.current = Object.assign({}, this.current, data)
		if (save) this.save()
	}

	save() { 
		localStorage.setItem(Settings.KEY, JSON.stringify(this.current))
	}
}