import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function CreateListForm() {
    const { setModal } = useContext(AppContext)

    return (
        <div className="shadow-md overflow-hidden w-3/4 h-96 rounded-md bg-[var(--secondary)] flex flex-col">
            <div className="w-full p-3 bg-[var(--primary)] flex items-center justify-between">
                <span className="text-[var(--octonary)] font-light">Create new list</span>
                <button 
                    className="w-10 p-1 rounded-md cursor-pointer transition-colors hover:bg-[var(--secondary)]"
                    onClick={() => setModal(null)}>
                    <FontAwesomeIcon icon={faXmark} className="text-[var(--octonary)]" />
                </button>
            </div>
            <div className="w-full grow p-3">

            </div>
        </div>
    )
}