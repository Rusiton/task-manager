import { useContext, useEffect, useState } from "react"
import { AppContext } from "./Context/AppContext"
import { Outlet, Link, useLocation } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket, faChalkboard, faEnvelopeOpenText, faGears, faHouse, faUser } from "@fortawesome/free-solid-svg-icons"
import { generateRandomString } from "../Utils/String"
import Modal from "./Components/Modal"

export default function Layout() {
    const { user, lastRouteParameter, setLastRouteParameter, modal, setModal, logoutUser } = useContext(AppContext)
    
    const location = useLocation()

    const locationArray = useLocation().pathname.split('/').filter(location => location !== '')
    if (lastRouteParameter) locationArray[locationArray.length - 1] = lastRouteParameter

    const availableLocations = [
        'boards',
        'user',
    ]

    /**
   * Set default states on the necessary elements when route changes
   */
    useEffect(() => {
        setLastRouteParameter(null)
        setModal(null)
    }, [location, setLastRouteParameter, setModal])
    
    const [userOptionsVisibility, setUserOptionsVisibility] = useState(false)

    return (
        <>
            <Modal modal={modal} />
            
            <header>
                <nav>
                    <div className="space-x-4">
                        <Link to={'/'} className="nav-link">
                            <FontAwesomeIcon icon={faHouse} size="2x" className="text-[var(--octonary)]" />
                        </Link>

                        <Link to={'/boards'} className="nav-link">
                            <FontAwesomeIcon icon={faChalkboard} size="2x" className="text-[var(--octonary)]" />
                        </Link>
                    </div>

                    {user ? (
                        <div className="relative">
                            <button className="cursor-pointer" onClick={() => setUserOptionsVisibility(!userOptionsVisibility)}>
                                <FontAwesomeIcon icon={faUser} size="xl" className="text-[var(--octonary)]" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to={'/login'} className="nav-link">Sign In</Link>
                            <Link to={'/register'} className="nav-link">Sign Up</Link>
                        </div>
                    )}
                </nav>

                {user && (
                    <div className={`${userOptionsVisibility ? 'deployed' : ''} dropdown-list absolute top-full right-0`}>

                        <Link to={`/user/${user ? user.name : 'profile'}`} className="dropdown-list-link" onClick={() => setUserOptionsVisibility(false)}>
                            <FontAwesomeIcon icon={faUser} size="lg" className="text-[var(--octonary)]" />
                            Profile
                        </Link>

                        <Link to={'/user/invitations'} className="dropdown-list-link" onClick={() => setUserOptionsVisibility(false)}>
                            <FontAwesomeIcon icon={faEnvelopeOpenText} size="lg" className="text-[var(--octonary)]" />
                            Invitations
                        </Link>

                        <Link to={'/user/settings'} className="dropdown-list-link" onClick={() => setUserOptionsVisibility(false)}>
                            <FontAwesomeIcon icon={faGears} size="lg" className="text-[var(--octonary)]" />
                            Settings
                        </Link>

                        <button className="dropdown-list-link text-[var(--red)] cursor-pointer" onClick={logoutUser}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} size="lg" />
                            Log Out
                        </button>

                    </div>
                )}

                <div className="page-index">
                    <ul>
                        {locationArray.map(location => 
                            <li key={generateRandomString()}>
                                { availableLocations.includes(location)
                                    ? <Link to={`/${location}`}>{location}</Link>
                                    : location
                                }
                            </li>
                        )}
                    </ul>
                </div>

            </header>

            <main>
                <Outlet />
            </main>
        </>
    )
}