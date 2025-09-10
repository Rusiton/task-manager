import { faClipboardQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EmptyProfileSection() {
    return (
        <div className="grow flex items-center justify-center">
            <div className="flex flex-wrap justify-center space-y-2">
                <FontAwesomeIcon icon={faClipboardQuestion} size="3x" className="text-[var(--quaternary)]" />
                <p className="w-full text-center text-sm text-[var(--quinary)]">
                    It seems like this section is empty... Maybe try with the others?
                </p>
            </div>
        </div>
    )
}