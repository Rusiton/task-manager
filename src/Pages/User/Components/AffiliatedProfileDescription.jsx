import { useState } from "react"

import ProfileSection from "./ProfileSection"
import SideNavigationList from "./SideNavigationList"

export default function AffiliatedProfileDescription({ queriedUser }) {
    const [section, setSection] = useState('Owned Boards')

    const navList = [
        'Owned Boards',
        'Participating Boards'
    ]

    return (
    <>

        <div className="section-card flex items-center">
            <div>
                <h1 className="title text-[var(--octonary)] font-semibold">
                    Welcome, {queriedUser.profile.name ? queriedUser.profile.name : queriedUser.name}.
                    </h1>
                <h2 className="text-sm font-light text-[var(--septenary)]">
                    {queriedUser.profile.name ? '@' + queriedUser.name : queriedUser.email}
                </h2>
                <p className="mt-2 text-xs italic text-[var(--quaternary)]">{queriedUser.profile.description}</p>
            </div>
            <div className="grow flex justify-center">
                <div className="float w-32 h-32 bg-gray-800 rounded-full">
                    {/* Profile picture should be here */}
                </div>
            </div>
        </div>

        <div className="grow h-0 flex gap-2">
            <SideNavigationList
                cssClass="option-list"
                section={section} 
                setSection={setSection} 
                navList={navList}
            />

            <div className="section-card grow p-0 flex flex-col">
                <div className="w-full shadow-md border-b border-[var(--tertiary)] px-4 py-2 bg-[var(--secondary)]">
                    <h3 className="text-xs text-[var(--octonary)] font-light">{ section }</h3>
                </div>

                <ProfileSection queriedUser={queriedUser} section={section} />
            </div>
        </div>

    </>)
}