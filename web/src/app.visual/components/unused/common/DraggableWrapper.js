import {DragSource} from "react-dnd";


/**
 * Creates a default draggable component
 * @param WrappedComponent component to make draggable
 * @param DraggableType identifier of type of object that is being dragged
 * @param idProp (optional) property lookup for id of the item being dragged (defaults to 'id'
 * @param endDragCallback (optional) called after successful drop
 * @returns wrapped draggable component
 */
function createDefaultDraggableWrapper(WrappedComponent, DraggableType, idProp, endDragCallback ) {

    const identifier = idProp || 'id';
    const source = {
        canDrag(props) {
            return true
        },

        isDragging(props, monitor) {
            return monitor.getItem()[identifier] === props[identifier]
        },

        beginDrag(props, monitor, component) {
            const item = { [identifier]: props[identifier], component:component }
            return item
        },

        endDrag(props, monitor, component) {
            if (!monitor.didDrop()) {
                return
            }
            if(endDragCallback) {
                endDragCallback();
            }
        },
    }
    function collect(connect, monitor) {
        return {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        }
    }
    return DragSource(DraggableType, source, collect)(WrappedComponent);
}

export default createDefaultDraggableWrapper;