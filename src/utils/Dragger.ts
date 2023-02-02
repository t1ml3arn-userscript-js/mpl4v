import Signal from "./signal";

type DragSignalData = {
    dragger: Dragger,
    mouseEvent?: MouseEvent,
}

export default class Dragger {

    target:HTMLElement;
    inDrag:boolean;

    readonly listener:EventTarget;
    readonly initiators:string[];

    readonly startDragSignal:Signal<DragSignalData> = new Signal()
    readonly endDragSignal:Signal<DragSignalData> = new Signal()

    private enabled:Boolean;
    private offsetX:number;
    private offsetY:number;

    /**
     * 
     * @param target What to drag
     * @param initiators List of elements' selectors, who can initiate dragging
     * @param listener Element that listens mousedown event (the whole document by default)
     */
    constructor(target:HTMLElement, initiators:string[], listener:EventTarget = null) {
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

    onMouseDown(e?:MouseEvent) {
        // NOTE event.button = 0 means main button (usually the left button)
        if (e.button == 0 && !this.inDrag){
            const match = this.initiators.find(selector => (e.target as HTMLElement).matches(selector));
            if (match) {
                // no one up in the document's tree will recieve this event 
                e.stopPropagation()
                this.startDrag(e)
            }
        }
    }

    cancelSelection(e:Event) { e.preventDefault() }

    startDrag(e?:MouseEvent) {
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
        style.transition = 'none'

        // set listeners 
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
        document.addEventListener('selectstart', this.cancelSelection)
    }

    onDrag(e:MouseEvent) {
        const x = e.pageX - this.offsetX;
        const y = e.pageY - this.offsetY;
        this.target.style.left = `${x}px`;
        this.target.style.top = `${y}px`;
    }

    stopDrag(e?:MouseEvent) {
        if (e && e.button != 0) return

        document.removeEventListener('mousemove', this.onDrag)
        document.removeEventListener('mouseup', this.stopDrag)
        document.removeEventListener('selectstart', this.cancelSelection)
        
        this.target.style.transition = null

        if (this.inDrag)
            this.convertCoordToPercents()
        this.inDrag = false

        this.endDragSignal.dispatch({
            dragger: this,
        })
    }

    /** Converts target position props into percents */
    convertCoordToPercents() {
        const cstyle = window.getComputedStyle(this.target)
        let left = this.tofloat(cstyle.left)
        let top = this.tofloat(cstyle.top)
        let right = this.tofloat(cstyle.right)
        let bottom = this.tofloat(cstyle.bottom)

        // find to which boundary target element is the closest
        const horProp:[string, number] = left >= right ? ["right", right] : ["left", left]
        // const vertProp = top >= bottom ? ["bottom", bottom] : ["top", top] 
        const vertProp:[string, number] = ["bottom", bottom]

        this.target.style.left = null
        this.target.style.top = null
        this.target.style.right = null
        this.target.style.bottom = null

        const { clientWidth, clientHeight} = document.documentElement
        // position target relatively to the closest boundary
        this.target.style.setProperty(horProp[0], `${horProp[1] * 100 / clientWidth }%`)
        this.target.style.setProperty(vertProp[0], `${vertProp[1] * 100 / clientHeight }%`)
    }

    tofloat(pixels:string) {
        return parseFloat(pixels.substring(0, pixels.length-2))
    }
}