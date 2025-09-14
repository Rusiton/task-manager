import { useContext} from "react"
import { AppContext } from "../Context/AppContext"

import useKey from '../../Hooks/useKey';

export default function Modal({ modal }) {
    const { setModal } = useContext(AppContext)

    const modalRef = useKey(['Escape'], () => {
        setModal(null)
    })

    return (
        <div ref={modalRef}
            className={"modal-container" + (!modal ? ' not-visible' : '')}>
            <div>
                { modal }
            </div>
        </div>
    )
}