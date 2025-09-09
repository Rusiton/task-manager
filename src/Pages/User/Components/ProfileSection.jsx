import api from "../../../Utils/ApiClient"

import { useContext, useEffect, useState } from "react"
import Boards from "./Boards"
import { AppContext } from "../../Context/AppContext"
import ProfileSectionError from "./ProfileSectionError"

export default function ProfileSection({ queriedUser, section }) {
    const { accessToken } = useContext(AppContext)

    const [isFetchingData, setIsFetchingData] = useState(true)

    const [userBoards, setUserBoards] = useState(null)
    const [elementSection, setElementSection] = useState(null)

    useEffect(() => {
        async function getUserBoards() {
            setIsFetchingData(true)

            const result = await api.get(`/auth/users/${queriedUser.token}/boards`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (result.success) {
                setUserBoards(result.data)
            }

            setIsFetchingData(false)
        }

        if (queriedUser && (section === 'Owned Boards' || section === 'Participating Boards')) {
            getUserBoards()
        }

    }, [section, queriedUser, accessToken])

    useEffect(() => {
        if (userBoards) {
            setElementSection(section === 'Owned Boards'
                ? <Boards boardList={userBoards.ownedBoards} />
                : <Boards boardList={userBoards.joinedBoards} />
            )
        }
    }, [userBoards, section])

    return (
        <div className="flex-1 p-4 flex flex-col">
            { !isFetchingData && elementSection }
        </div>
    )
}