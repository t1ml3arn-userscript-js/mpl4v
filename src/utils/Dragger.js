export default class Dragger {

    /**
     * 
     * @param {Element} target What to drag
     * @param {Array} initiators List of elements' classes, who can initiate dragging
     */
    constructor(target, initiators) {
        this.target = target
        this.initiators = initiators
        this.enabled = false;
        this.inDrag = false;

        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this)
        this.onDrag = this.onDrag.bind(this)
        this.stopDrag = this.stopDrag.bind(this)
    }

    enable() {
        if (this.enabled) return;

        document.addEventListener('mousedown', this.onDocumentMouseDown);
        
        this.enabled = true;
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    onDocumentMouseDown(e) {
        // NOTE event.button = 0 means main button (usually the left button)
        if (e.button == 0 && !this.inDrag){
            const match = this.initiators.find(selector => e.target.matches(selector));
            if (match) {
                // this should disable text selection
                e.preventDefault()
                // no one will recieve this event
                e.stopImmediatePropagation()
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
        // document.removeEventListener('mousedown', this.onDocumentMouseDown);
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
        if (!this.inDrag || e.button != 0) return;

        document.removeEventListener('mousemove', this.onDrag)
        document.removeEventListener('mouseup', this.stopDrag)
        this.inDrag = false
    }
}