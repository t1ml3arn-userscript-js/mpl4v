export default class MouseStopWatcher {

    ismoving = false;

    constructor(delay, onMouseStop, onMouseMove=null, onMouseStart = null) {
        this.onMouseStop = onMouseStop
        this.delay = delay
        this.onMouseMove = onMouseMove
        this.onMouseStart = onMouseStart
    }

    enable = () => {
        this.ismoving = false
        document.addEventListener('mousemove', this.onMove)
    }
    
    disable = () => {
        this.ismoving = false
        document.removeEventListener('mousemove', this.onMove)
        clearTimeout(this.timerId)
    }

    onMove = () => {
        clearTimeout(this.timerId)

        if (!this.ismoving && this.onMouseStart) {
            this.ismoving = true
            this.onMouseStart()
        }

        this.timerId = setTimeout(this._onMouseStopInternal, this.delay);

        if (this.onMouseMove)
            this.onMouseMove()
    }

    _onMouseStopInternal = () => {
        this.ismoving = false;
        this.onMouseStop()
    }
}