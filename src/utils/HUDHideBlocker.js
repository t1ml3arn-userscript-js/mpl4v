import MouseStopWatcher from './MouseStopWatcher'



export default class HUDHideBlocker {

    _enabled = false

    constructor(delay, setHideState, setShowState, classlist) {
        this.mouseStop = new MouseStopWatcher(delay, setHideState, setShowState)
        this.classlist = classlist
    }

    enable = () => {
        if (this._enabled)  return
        this._enabled = true
        this.mouseStop.enable()
        this.addListeners()
    }

    disable = () => {
        if (!this._enabled) return
        this._enabled = false
        this.mouseStop.disable()
        this.removeListeners()
    }

    addListeners() {
        for (const cl of this.classlist) {
            const elts = Array.from(document.querySelectorAll(`.${cl}`))
            elts.forEach(e => e.addEventListener('mouseover', this.mouseOver))
            elts.forEach(e => e.addEventListener('mouseleave', this.mouseLeave))
        }
    }
    
    removeListeners() {
        for (const cl of this.classlist) {
            const elts = Array.from(document.querySelectorAll(`.${cl}`))
            elts.forEach(e => e.removeListeners('mouseover', this.mouseOver))
            elts.forEach(e => e.removeListeners('mouseleave', this.mouseLeave))
        }
    }

    mouseOver = e => {
        this.mouseStop.disable()
    }
    
    mouseLeave = e => {
        this.mouseStop.enable()
    }
}
