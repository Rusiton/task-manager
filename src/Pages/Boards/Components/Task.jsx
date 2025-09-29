import { useContext } from "react"
import { AppContext } from "../../Context/AppContext";

import ExpandedTask from "./ExpandedTask";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";

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
            style={style}
            className="shadow-md w-full min-h-12 px-3 py-2 rounded-md bg-[var(--secondary)] flex gap-1 cursor-pointer outline-[var(--blue)] hover:outline-2 touch-none"
            onClick={() => {setModal(<ExpandedTask task={task} board={board} setBoard={setBoard} />)}}>

            <div className="grow flex items-center overflow-hidden">
                <p className="max-w-full text-left text-xs text-[var(--octonary)] break-words">
                    { task.name }
                </p>
            </div>

            <button className=""
                { ...attributes }
                { ...listeners }>
                    <FontAwesomeIcon icon={faGripLines} size="md" className="text-[var(--septenary)] opacity-50" />
            </button>

        </div>
    )
}