import { computed, makeAutoObservable, observable, reaction } from "mobx";
import { supportedFormats } from "./utils/utils";

const formatsReg = RegExp(`.(${supportedFormats.join('|')})$`, 'i')

export class DropMedia {
	/** @type {string} */
	droppedMediaURL;
	/** @type {Boolean} */
	isMediaDrag;
	/** @type {Boolean} */
	isMediaOverDrop;

	/** @type {import("react").RefObject} */
	dropTargetRef;

	/** @type {HTMLElement} */
	get dropTarget() { return this.dropTargetRef?.current }

	/** The current or last media dragged media element.
	 * @type {HTMLElement} */
	draggedElt = null;

	constructor(dropTargetRef) {
		makeAutoObservable(this, {
			dropTargetRef: observable,
			dropTarget: computed,
			draggedElt: observable.ref,
			onDragOver: false,
		})

		this.dropTargetRef = dropTargetRef

		reaction(() => this.dropTarget, (elt, oldElt) => {
			if (oldElt && oldElt !== elt) {
				document.removeEventListener('dragstart', this.onDragStart)
				document.removeEventListener('dragend', this.onDragEnd)

				oldElt.removeEventListener('dragleave', this.onDragLeave)
				oldElt.removeEventListener('dragover', this.onDragOver)
				oldElt.removeEventListener('dragenter', this.onDragEnter)
				oldElt.removeEventListener('drop', this.onDrop)
			}

			if (elt) {
				document.addEventListener('dragstart', this.onDragStart)
			}
		})
	}

	removeListeners = () => {
		document.removeEventListener('dragend', this.onDragEnd)

		this.dropTarget.removeEventListener('dragleave', this.onDragLeave)
		this.dropTarget.removeEventListener('dragover', this.onDragOver)
		this.dropTarget.removeEventListener('dragenter', this.onDragEnter)
		this.dropTarget.removeEventListener('drop', this.onDrop)
	}

	onDragStart = e => {
		// URL is a special type to get the first valid url
		const url = e.dataTransfer.getData('URL')

		if (!url) return
		if (!formatsReg.test(url)) return

		this.isMediaDrag = true
		this.isMediaOverDrop = false
		this.draggedElt = e.target

		document.addEventListener('dragend', this.onDragEnd)
		// NOTE drop and dragenter event listeners adds directly to a DOM element
		this.dropTarget.addEventListener('dragenter', this.onDragEnter)
		this.dropTarget.addEventListener('dragover', this.onDragOver)
		this.dropTarget.addEventListener('dragleave', this.onDragLeave)
		this.dropTarget.addEventListener('drop', this.onDrop)
	}

	onDragEnd = () => {
		this.removeListeners()
		this.isMediaDrag = false
		this.isMediaOverDrop = false
		this.droppedMediaURL = null
		// NOTE draggedElt must be reset at the very end
		// so consumers that rely on url could read
		// this element.
		this.draggedElt = null
	}

	onDragOver = e => e.preventDefault()
	onDragLeave = () => this.isMediaOverDrop = false

	onDrop = e => {
		e.preventDefault()

		this.droppedMediaURL = e.dataTransfer.getData('URL')
	}

	onDragEnter = e => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
		this.isMediaOverDrop = true
	}
}