import { faCheck, faEdit, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ExpandedTaskOptions({ mode, setMode, removeTask, cancelUpdate, saveChanges }) {
    return (
        <div className="space-x-2">
            { mode  === 'display' ?
                <>
                    <button
                        className="w-10 rounded-sm p-1 bg-[var(--blue)] transition-colors cursor-pointer hover:bg-[var(--purple)]"
                        onClick={() => setMode('edit')}>
                            <FontAwesomeIcon icon={faEdit} className="text-[var(--primary)]" />
                    </button>
                    <button
                        className="w-10 rounded-sm p-1 bg-[var(--red)] transition-colors cursor-pointer hover:bg-[var(--strongred)]"
                        onClick={removeTask}>
                            <FontAwesomeIcon icon={faTrash} className="text-[var(--primary)]" />
                    </button>
                </>
                :
                <>
                    <button
                        className="w-10 rounded-sm p-1 bg-[var(--quaternary)] transition-colors cursor-pointer hover:bg-[var(--quinary)]"
                        onClick={cancelUpdate}>
                            <FontAwesomeIcon icon={faXmark} className="text-[var(--primary)]" />
                    </button>
                    <button
                        className="w-10 rounded-sm p-1 bg-[var(--green)] transition-colors cursor-pointer hover:bg-[var(--blue)]"
                        onClick={saveChanges}>
                            <FontAwesomeIcon icon={faCheck} className="text-[white]" />
                    </button>
                </>
            }
        </div>
    )
}