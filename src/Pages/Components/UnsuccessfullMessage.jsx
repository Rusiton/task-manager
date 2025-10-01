import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UnsuccessfullMessage({ message }) {
    return (
        <div className="popup-error">
            <p className="min-w-0 flex-1 break-words">{ message }</p>
            <div className="w-9 h-9 rounded-full bg-gray-200 grid place-content-center">
                <FontAwesomeIcon icon={faExclamation} size="xl" className="text-gray-600" />
            </div>
        </div>
    )
}