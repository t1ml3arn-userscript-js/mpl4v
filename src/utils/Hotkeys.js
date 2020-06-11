export default class Hotkeys {
    constructor(target) {
        this.target = target
        this.combos = []
    }

    enable() {
        this.target.addEventListener('keydown', this.ondown)
    }

    disable() {
        this.target.removeEventListener('keydown', this.ondown)
    }

    /**
     * @param {Object} combo Object with `key` keycode(string), `shift`(bool) and `action`(function)
     */
    addCombo(combo) {
        this.combos.push(combo)
    }

    ondown = e => {
        if (e.repeat)   return
        for (const combo of this.combos) {
            let match = true
            match = match && (combo.shift !== undefined) && (combo.shift === e.shiftKey)
            match = match && (combo.key.toLowerCase() === e.key.toLowerCase())

            if (match) {
                combo.action()

                // stop propagation for not letting React recieve this event 
                e.stopPropagation()
                if (!combo.preventDefault)  e.preventDefault()
            }
        }        
    }
}