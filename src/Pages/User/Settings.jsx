import { useEffect, useState } from "react"

import AccountSettings from "./Components/AccountSettings"
import SideNavigationMenu from "./Components/SideNavigationMenu"
import SuccessfullMessage from "../Components/SuccessfullMessage"
import ProfileSettings from "./Components/ProfileSettings"
import PreferencesSettings from "./Components/PreferencesSettings"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleUser, faSliders, faUser } from "@fortawesome/free-solid-svg-icons"

export default function Settings() {
    const [section, setSection] = useState('Account')
    
    const navList = [
        {
            value: 'Account', 
            icon: <FontAwesomeIcon icon={faUser} size="lg" />,
        },
        {
            value: 'Profile', 
            icon: <FontAwesomeIcon icon={faCircleUser} size="lg" />,
        },
        {
            value: 'Preferences', 
            icon: <FontAwesomeIcon icon={faSliders} size="lg" />,
        },
    ]

    const [popupMessage, setPopupMessage] = useState(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (popupMessage) {
                setPopupMessage(null)
            }
        }, 3000);

        return () => clearTimeout(timeout)
    }, [popupMessage])

    return (
        <div className="page-container">
            <div className="w-full h-full shadow-md bg-[var(--secondary)] flex gap-2 justify-center">
                <SideNavigationMenu
                    cssClass="option-list"
                    section={section}
                    setSection={setSection}
                    navList={navList}
                />

                <div className="section-card grow flex flex-col items-center overflow-y-auto">
                    <div className="relative m-0 w-full">
                        <SuccessfullMessage message={popupMessage} cssClass={popupMessage ? "translate-y-0" : "translate-y-[-150%] opacity-0"} />
                    </div>

                    { section === 'Account' && <AccountSettings setMessage={setPopupMessage} />}

                    { section === 'Profile' && <ProfileSettings setMessage={setPopupMessage} />}

                    { section === 'Preferences' && <PreferencesSettings setMessage={setPopupMessage} />}
                </div>
            </div>
        </div>
    )
}