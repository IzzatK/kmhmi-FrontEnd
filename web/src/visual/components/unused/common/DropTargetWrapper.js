import { DropTarget } from 'react-dnd'

/**
 * Creates a component that listens for dropped items
 * @param WrappedComponent component to make droppable
 * @param DraggableType identifier of type of object(s) that can be dropped (can be a string or array)
 * @param canDropCallback (optional) called to determine if item may be dropped *Note it will be looking for a named function in the PROPS object of the react component
 * @param onDropCallback (optional) called after successful drop *Note it will be looking for a named function in the PROPS object of the react component
 * @returns wrapped draggable component
 */
function  createDefaultDropTarget(WrappedComponent, DraggableType, canDropCallback, onDropCallback, moved)
{
    const target = {
        canDrop(props, monitor) {
            const item = monitor.getItem()
            if(props[canDropCallback])
                props[canDropCallback](item, monitor);
            return true;
        },

        drop(props, monitor, component) {
            if (monitor.didDrop()) {
                return
            }
            const item = monitor.getItem()

            if(props[onDropCallback])
                props[onDropCallback](item, monitor, component);

            return { moved: moved }
        },
    }

    /**
     * Specifies which props to inject into your component.
     */
    function collect(connect, monitor) {
        return {
            connectDropTarget: connect.dropTarget(),
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({ shallow: true }),
            canDrop: monitor.canDrop(),
            itemType: monitor.getItemType(),
        }
    }
    return DropTarget(DraggableType, target, collect)(WrappedComponent)
}

export default createDefaultDropTarget;