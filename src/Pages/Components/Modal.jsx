import { useContext, useRef} from "react"
import { AppContext } from "../Context/AppContext"

import useKey from '../../Hooks/useKey';

export default function Modal({ modal }) {
    const { setModal } = useContext(AppContext)

    const modalContainerRef = useKey(['Escape'], () => {
        setModal(null)
    })

    const modalRef = useRef(null)

    const handleModalClick = (event) => {
        if (modalRef.current === event.target)
            setModal(null)
    }

    return (
        <div ref={modalContainerRef}
            className={"modal-container" + (!modal ? ' not-visible' : '')}>
            <div ref={modalRef} onMouseDown={handleModalClick}>
                { modal }
            </div>
        </div>
    )
}