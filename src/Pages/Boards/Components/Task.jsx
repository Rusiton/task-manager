import { useContext } from "react"
import { AppContext } from "../../Context/AppContext";

import ExpandedTask from "./ExpandedTask";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Task({ task, board, setBoard }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.token,
        data: { type: 'task' }
    });
    
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    const { setModal } = useContext(AppContext)
    
    return (
        <div 
            ref={setNodeRef}
            { ...attributes }
            { ...listeners }
            style={style}
            className="shadow-md w-full min-h-12 px-3 py-2 rounded-md bg-[var(--secondary)] flex flex-wrap cursor-pointer outline-[var(--blue)] hover:outline-2 touch-none"
            onClick={() => {setModal(<ExpandedTask task={task} board={board} setBoard={setBoard} />)}}
            >
            <p className="w-full text-left text-xs text-[var(--octonary)] break-words">
                { task.name }
            </p>
        </div>
    )
}