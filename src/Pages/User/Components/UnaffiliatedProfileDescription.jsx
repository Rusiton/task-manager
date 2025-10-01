import { useState } from "react"

import SideNavigationList from "./SideNavigationList"
import ProfileSection from "./ProfileSection"

export default function UnaffiliatedProfileDescription({ queriedUser }) {
    const [profileNavigation, setProfileNavigation] = useState('Owned Boards')

    const navList = [
        'Owned Boards',
        'Participating Boards'
    ]

    return (
    <>

        <div className="section-card flex items-center">
            <div>
                <h1 className="title font-semibold">
                    {queriedUser.profile.name ? queriedUser.profile.name : queriedUser.name}.
                    </h1>
                <h2 className="text-sm font-light text-[var(--septenary)]">
                    {queriedUser.name && '@' + queriedUser.name}
                    </h2>
                <p className="text-sm italic">{queriedUser.profile.description}</p>
            </div>
            <div className="grow flex justify-center">
                <div className="float w-32 h-32 bg-gray-800 rounded-full">
                    
                </div>
            </div>
        </div>

        <div className="grow h-0 flex gap-2">
            <SideNavigationList 
                cssClass="option-list"
                section={profileNavigation} 
                setSection={setProfileNavigation} 
                navList={navList}    
            />

            <div className="section-card grow p-0 flex flex-col">
                <div className="w-full shadow-md border-b border-[var(--tertiary)] px-4 py-2 bg-[var(--secondary)]">
                    <h3 className="text-xs text-[var(--octonary)] font-light">{ profileNavigation }</h3>
                </div>

                <ProfileSection queriedUser={queriedUser} section={profileNavigation} />
            </div>
        </div>

    </>)
}