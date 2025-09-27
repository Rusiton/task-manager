import { useContext, useEffect, useRef } from "react"
import { AppContext } from "../Context/AppContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faListCheck } from "@fortawesome/free-solid-svg-icons"

export default function PageLoader() {
    const { isLoadingUser } = useContext(AppContext)
    const loaderRef = useRef(null)

    useEffect(() => {
        if (!isLoadingUser) {
            loaderRef.current.classList.add("fade")

            setTimeout(() => {
                loaderRef.current.classList.add("hidden")
            }, 500);
        }
    }, [isLoadingUser])

    return (
        <div ref={loaderRef} className="page-loader">
            <div className="spinner">
                <FontAwesomeIcon icon={faListCheck} size="2x" className="text-[var(--octonary)]" />
            </div>
        </div>
    )
}