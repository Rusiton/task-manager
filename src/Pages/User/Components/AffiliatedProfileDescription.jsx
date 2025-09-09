import { useState } from "react"
import ProfileNav from "./ProfileNav"
import ProfileSection from "./ProfileSection"

export default function AffiliatedProfileDescription({ queriedUser }) {
    const [profileNavigation, setProfileNavigation] = useState('Owned Boards')

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
            <div className="flex-1 flex justify-center">
                <div className="float w-32 h-32 bg-gray-800 rounded-full">
                    {/* Profile picture should be here */}
                </div>
            </div>
        </div>

        <div className="flex-1 flex gap-2">
            <div className="section-card w-1/6 min-w-48">
                <ProfileNav 
                    profileNavigation={profileNavigation} 
                    setProfileNavigation={setProfileNavigation} 
                    navList={navList}
                />
            </div>

            <div className="section-card flex-1 p-0 flex flex-col">
                <div className="w-full shadow-md border-b border-[var(--tertiary)] px-4 py-2 bg-[var(--secondary)]">
                    <h3 className="text-xs font-light">{ profileNavigation }</h3>
                </div>

                <ProfileSection queriedUser={queriedUser} section={profileNavigation} />
            </div>
        </div>

    </>)
}