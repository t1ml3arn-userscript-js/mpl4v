import React from 'react'

export default function drangAndDropMedia(DropTarget) {

return class MediaDragAndDrop extends React.Component {
    
    constructor(props) {
        super(props)

        this.state = {
            isMediaDrag: false,
            isMediaOverDrop: false, 
            droppedMediaURL: null,  // stores the last dropped media URL
        }

        this.dropTargetRef = React.createRef()
    }

    componentDidMount() {
        document.addEventListener('dragstart', this.onDragStart)
    }
    
    componentWillUnmount() {
        document.removeEventListener('dragstart', this.onDragStart)
        
        this.removeDraggingListeners()
    }
    
    /**
     * Removes active dragging event listeners
     */
    removeDraggingListeners = () => {
        document.removeEventListener('dragend', this.onDragEnd)

        this.dropTargetRef.current.removeEventListener('dragleave', this.onDragLeave)
        this.dropTargetRef.current.removeEventListener('dragover', this.onDragOver)
        this.dropTargetRef.current.removeEventListener('dragenter', this.onDragEnter)
        this.dropTargetRef.current.removeEventListener('drop', this.onDrop)
    }

    onDragStart = e => {
        // URL is a special type to get the first valid url
        const url = e.dataTransfer.getData('URL')
        if (!url)   return
        
        const reg = /\.(3gp|flac|mp3|mp4|webm|ogg|mov)$/i
        if (!url.match(reg)) return
        
        this.setState({ isMediaDrag: true, isMediaOverDrop:false })
        
        document.addEventListener('dragend', this.onDragEnd)
        // NOTE drop and dragenter event listeners adds directly to a DOM element
        this.dropTargetRef.current.addEventListener('dragleave', this.onDragLeave)
        this.dropTargetRef.current.addEventListener('dragover', this.onDragOver)
        this.dropTargetRef.current.addEventListener('dragenter', this.onDragEnter)
        this.dropTargetRef.current.addEventListener('drop', this.onDrop)
    }
    
    onDragEnd = e => {
        this.removeDraggingListeners()
        this.setState({ isMediaDrag: false, isMediaOverDrop:false })
    }
    
    onDragEnter = e => {
        if (!this.state.isMediaDrag) return
        if (e.target != this.dropTargetRef.current) return
        
        e.preventDefault()

        this.setState({ isMediaOverDrop: true })
    }
    
    onDragOver = e => e.preventDefault()

    onDragLeave = e => {
        if (!this.state.isMediaDrag) return
        if (e.target != this.dropTargetRef.current) return
        
        this.setState({ isMediaOverDrop: false })
    }

    onDrop = e => {
        console.log(e.type);
        if (!this.state.isMediaDrag) return
        if (e.target != this.dropTargetRef.current) return
        
        e.preventDefault()

        const url = e.dataTransfer.getData('URL')
        this.setState({ droppedMediaURL: url })
    }

    render() {
        return (
        <DropTarget 
            dropTargetRef={ this.dropTargetRef } 
            isMediaDrag={ this.state.isMediaDrag }
            isMediaOverDrop={ this.state.isMediaOverDrop }
            droppedMediaURL={ this.state.droppedMediaURL }
            { ...this.props }
        />
        )
    }
};

} 

export function DropTargetExample(props) {
    const { dropTargetRef, isMediaDrag, isMediaOverDrop, droppedMediaURL } = props;
    let color = isMediaDrag ? 'green' : 'lightgreen'
    color = isMediaOverDrop ? 'blue' : color 

    const style = {
        display: 'block',
        width: '200px',
        height: '200px',
        backgroundColor: color,
    }

    return (
        <div ref={dropTargetRef} style={ style }>
            {droppedMediaURL}
        </div>
    )
}