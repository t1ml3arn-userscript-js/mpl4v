export default class ProgressCalculator {
    originX;
    originY;
    currentX;
    currentY;
    elt;
    isHorizontal = true;
    constructor() { }
    /**
     *
     * @param {MouseEvent} event
     * @param {Element} elt
     * @param {Boolean} isHorizontal
     */
    init(event, elt, isHorizontal = true) {
        this.elt = elt;
        this.isHorizontal = isHorizontal;
        // calculate and set origin coordinate 
        // of clicked element in page scope
        const rect = elt.getBoundingClientRect();
        this.originX = rect.left;
        this.originY = rect.top;
        this.update(event);
    }
    /**
     *
     * @param {MouseEvent} event
     */
    update(event) {
        // set current mouse coord in page scope
        this.currentX = event.pageX;
        this.currentY = event.pageY;
    }
    /**
     * Returns progress, in percents.
     * NOTE: returned value is not bounded
     * and can be less than 0 or greater than 100
     * @returns {Number}
     */
    getProgress() {
        const rect = this.elt.getBoundingClientRect();
        const size = this.isHorizontal ? rect.width : rect.height;
        const path = this.isHorizontal ? this.currentX - this.originX : this.currentY - this.originY;
        return path * 100 / size;
    }
}
