import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function UserNotFoundCard() {
    return (
    <>

        <div className="section-card space-y-2 flex flex-wrap justify-center">
            <div className="flex-1">
                <h1 className="title font-normal">Oops! Did you misspell?</h1>
                <p className="text-md font-light">It seems that the user you are looking for... doesnt exist?</p>
            </div>
            <FontAwesomeIcon icon={faCircleQuestion} size="6x" className="text-[var(--quaternary)]" />
        </div>

    </>)
}