const PROPS = new Map()
PROPS.set('shiftKey', null)
PROPS.set('code', null)
PROPS.set('key', (comboVal, eventVal) => comboVal.toLowerCase() === eventVal.toLowerCase())

export default class HotkeysController {
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
        
        const acc = { event: e }

        for (const combo of this.combos) {
            acc.combo = combo
            acc.match = true
            const result = [...PROPS.entries()].reduce(this.reducer, acc)
            
            if (result.match) {
                combo.action()

                // stop propagation for not letting React recieve this event 
                e.stopPropagation()
                if (!combo.preventDefault)  e.preventDefault()

                return
            }
        }        
    }

    reducer(acc, kv) {
        const e = acc.event
        const c = acc.combo
        // property name
        const prop = kv[0]
        // comparator function
        const cmp = kv[1]
        const match = c[prop] !== undefined ? 
            // if no comparator is provided then compare values directly
            (cmp ? cmp(c[prop], e[prop]) : e[prop] === c[prop])
            : true
        acc.match = acc.match && match
        return acc
    }
}