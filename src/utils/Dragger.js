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
    }

    enable() {
        if (this.enabled) return;

        document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this));
        
        this.enabled = true;
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    onDocumentMouseDown(e) {
        if (e.button == 0 && !this.inDrag){
            const match = this.initiators.find(selector => e.target.matches(selector));
            if (match) {
                // this should disable text selection
                e.preventDefault()
                // no one will recieve this event
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
        console.log('drag started')
        this.inDrag = true;
        // calc offset
        // set styles
        // add listeners to move and up events
    }
}