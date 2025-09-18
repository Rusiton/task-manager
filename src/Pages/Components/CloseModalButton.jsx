import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CloseModalButton({ setModal }) {
    return (
        <button 
            className="w-10 p-1 rounded-md cursor-pointer transition-colors hover:bg-[var(--secondary)]"
            onClick={() => setModal(null)}>
            <FontAwesomeIcon icon={faXmark} className="text-[var(--octonary)]" />
        </button>
    )
}