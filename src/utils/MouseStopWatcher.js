export default class MouseStopWatcher {

    constructor(delay, onMouseStop) {
        this.onMouseStop = onMouseStop
        this.delay = delay
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
    }
}