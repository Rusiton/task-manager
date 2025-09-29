import { useDroppable } from "@dnd-kit/core";

export default function Droppable({ id, index = undefined, children, cssClass = '' }) {
    const { setNodeRef } = useDroppable({
        id,
        data: {
            index: index
        }
    })

    return (
        <div ref={setNodeRef} className={cssClass}>
            { children }
        </div>
    )
}