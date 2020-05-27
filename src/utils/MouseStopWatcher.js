export default class MouseStopWatcher {

    constructor(delay, onMouseStop, onMouseMove=null) {
        this.onMouseStop = onMouseStop
        this.delay = delay
        this.onMouseMove = onMouseMove
    }

    enable = () => {
        document.addEventListener('mousemove', this.onMove)
    }
    
    disable = () => {
        document.removeEventListener('mousemove', this.onMove)
        clearTimeout(this.timerId)
    }

    onMove = () => {
        clearTimeout(this.timerId)

        this.timerId = setTimeout(this.onMouseStop, this.delay);

        if (this.onMouseMove)
            this.onMouseMove()
    }
}