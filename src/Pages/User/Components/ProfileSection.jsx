import api from "../../../Utils/ApiClient"

import { useContext, useEffect, useState } from "react"
import Boards from "./Boards"
import { AppContext } from "../../Context/AppContext"
import ProfileSectionError from "./ProfileSectionError"
import LoadingSectionComponent from "./LoadingSectionComponent"

export default function ProfileSection({ queriedUser, section }) {
    const { accessToken } = useContext(AppContext)

    const [isFetchingData, setIsFetchingData] = useState(true)

    const [userBoards, setUserBoards] = useState(null)
    const [elementSection, setElementSection] = useState(null)

    useEffect(() => {
        setUserBoards(null), setElementSection(null)

        async function getUserBoards() {
            setIsFetchingData(true)

            const result = await api.get(`/auth/users/${queriedUser.token}/boards`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (result.success) {
                setUserBoards(result.data)
            } else {
                setElementSection(<ProfileSectionError />)
            }

            setIsFetchingData(false)
        }

        if (queriedUser && (section === 'Owned Boards' || section === 'Participating Boards')) {
            getUserBoards()
        }

    }, [section, queriedUser, accessToken])

    useEffect(() => {
        if (isFetchingData) {
            
            setElementSection(<LoadingSectionComponent type={
                section.includes('Boards') && 'board'
            } />)

        }

        if (userBoards) {
            setElementSection(section === 'Owned Boards'
                ? <Boards boardList={userBoards.ownedBoards} />
                : <Boards boardList={userBoards.joinedBoards} />
            )
        }
    }, [isFetchingData, userBoards, section])

    return (
        <div className="w-full grow p-4 flex flex-col space-y-2 overflow-y-auto">
            { elementSection }
        </div>
    )
}