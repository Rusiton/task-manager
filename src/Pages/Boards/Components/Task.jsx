import { useContext } from "react"
import { AppContext } from "../../Context/AppContext";
import ExpandedTask from "./ExpandedTask";

export default function Task({ task, board, setBoard }) {
    const { setModal } = useContext(AppContext)
    
    return (
        <button 
            className="shadow-md w-full min-h-12 px-3 py-2 rounded-md bg-[var(--secondary)] flex flex-wrap cursor-pointer outline-[var(--blue)] hover:outline-2"
            onClick={() => {
                setModal(<ExpandedTask task={task} board={board} setBoard={setBoard} />)
            }}
            >
            <p className="w-full text-left text-xs text-[var(--octonary)] break-words">
                { task.name }
            </p>
        </button>
    )
}