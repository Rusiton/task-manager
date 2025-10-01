import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SuccessfullMessage({ message, cssClass = '' }) {
    return (
        <div className={`popup-message ${cssClass}`}>
            <p className="min-w-0 flex-1 break-words">{ message }</p>
            <div className="w-9 h-9 rounded-full bg-gray-200 grid place-content-center">
                <FontAwesomeIcon icon={faCheck} size="xl" className="text-gray-600" />
            </div>
        </div>
    )
}