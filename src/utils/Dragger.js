export default class Dragger {

    /**
     * 
     * @param {Element} target What to drag
     * @param {Array} initiators List of elements' selectors, who can initiate dragging
     * @param {EventTarget} listener Element that listens mousedown event (the whole document by default)
     */
    constructor(target, initiators, listener = null) {
        this.target = target
        this.initiators = initiators
        this.enabled = false;
        this.inDrag = false;
        this.listener = listener ? listener : document

        this.onMouseDown = this.onMouseDown.bind(this)
        this.onDrag = this.onDrag.bind(this)
        this.stopDrag = this.stopDrag.bind(this)
    }

    enable() {
        if (this.enabled) return;

        this.listener.addEventListener('mousedown', this.onMouseDown);
        
        this.enabled = true;
    }
    
    disable() {
        if (!this.enabled) return
        
        this.stopDrag()
        this.enabled = false

        this.listener.removeEventListener('mousedown', this.onMouseDown);
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    onMouseDown(e) {
        // NOTE event.button = 0 means main button (usually the left button)
        if (e.button == 0 && !this.inDrag){
            const match = this.initiators.find(selector => e.target.matches(selector));
            if (match) {
                // this should disable text selection
                // sadly, this also disables ability to change cursor icon
                // e.preventDefault()

                // no one up in the document's tree will recieve this event 
                e.stopPropagation()
                this.startDrag(e)
            }
        }
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    startDrag(e) {
        this.inDrag = true;

        // calc offset
        const bounds = this.target.getBoundingClientRect()
        this.offsetX = e.pageX - bounds.left;
        this.offsetY = e.pageY - bounds.top;
        
        // set styles
        const compStyle = window.getComputedStyle(this.target)
        const left = compStyle.left;
        const top = compStyle.top;
        const style = this.target.style;
        // reset right and bottom rules
        // so they dont affect element's position 
        style.right = null;
        style.bottom = null;
        style.left = left;
        style.top = top;

        // set listeners 
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
    }

    onDrag(e) {
        const x = e.pageX - this.offsetX;
        const y = e.pageY - this.offsetY;
        this.target.style.left = `${x}px`;
        this.target.style.top = `${y}px`;
    }

    stopDrag(e) {
        if (e && e.button != 0) return

        document.removeEventListener('mousemove', this.onDrag)
        document.removeEventListener('mouseup', this.stopDrag)
        
        if (this.inDrag)
            this.convertCoordToPercents()
        this.inDrag = false
    }

    /** Converts target position props into percents */
    convertCoordToPercents() {
        const cstyle = window.getComputedStyle(this.target)
        let { left, top, right, bottom } = cstyle
        left = this.toint(left)
        top = this.toint(top)
        right = this.toint(right)
        bottom = this.toint(bottom)

        // find to which boundary target element is the closest
        const horProp = left >= right ? ["right", right] : ["left", left]
        // const vertProp = top >= bottom ? ["bottom", bottom] : ["top", top] 
        const vertProp = ["bottom", bottom]

        this.target.style.left = null
        this.target.style.top = null
        this.target.style.right = null
        this.target.style.bottom = null

        // position target relatively to the closest boundary
        this.target.style[horProp[0]] = `${horProp[1] * 100 / window.innerWidth}%`
        this.target.style[vertProp[0]] = `${vertProp[1] * 100 / window.innerHeight}%`
    }

    toint(pixels) {
        return parseInt(pixels.substring(0, pixels.length-2))
    }
}