import { useContext, useState } from "react"
import { AppContext } from "./Context/AppContext"
import { Outlet, Link, useLocation } from "react-router-dom"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGears, faHouse, faUser } from "@fortawesome/free-solid-svg-icons"
import { generateRandomString } from "../Utils/String"

export default function Layout() {
    const { user } = useContext(AppContext)

    const locationArray = useLocation().pathname.split('/').filter(location => location !== '')
    const availableLocations = [
        'user'
    ]
    
    const [userOptionsVisibility, setUserOptionsVisibility] = useState(false)

    return (
        <>
            <header>
                <nav>
                    <div>
                        <Link to={'/'} className="nav-link">
                            <FontAwesomeIcon icon={faHouse} size="2x" className="text-[var(--octonary)]" />
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

                        <Link to={'/user/settings'} className="dropdown-list-link" onClick={() => setUserOptionsVisibility(false)}>
                            <FontAwesomeIcon icon={faGears} size="lg" className="text-[var(--octonary)]" />
                            Settings
                        </Link>

                    </div>
                )}

                <div className="page-index">
                    <ul>
                        <li>
                            <Link to={'/'}>Home</Link>
                        </li>

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