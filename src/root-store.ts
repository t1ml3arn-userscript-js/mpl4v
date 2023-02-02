import { PlayerModel } from "./player/model/PlayerModel";
import { ScreenModel } from "./player/model/ScreenModel";
import Settings from "./settings/settings";
import React from 'react'

export default class RootStore {

	readonly settings: Settings;
	readonly player: PlayerModel;
	readonly appearance: ScreenModel;

	constructor() {

		this.settings = new Settings()
		this.player = new PlayerModel()
		this.appearance = new ScreenModel(this)
	}
}

export const StoreContext = React.createContext()