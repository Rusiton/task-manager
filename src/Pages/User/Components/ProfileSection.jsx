import api from "../../../Utils/ApiClient"

import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../Context/AppContext"
import UserBoards from "../../Components/UserBoards"
import ProfileSectionError from "./ProfileSectionError"
import LoadingBoards from "../../Components/LoadingBoards"

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
            
            section.includes('Boards') &&
                setElementSection(<LoadingBoards boardStyle="row" />)

        }

        if (userBoards) {
            setElementSection(section === 'Owned Boards'
                ? <UserBoards boardList={userBoards.ownedBoards} />
                : <UserBoards boardList={userBoards.joinedBoards} />
            )
        }
    }, [isFetchingData, userBoards, section])

    return (
        <div className="w-full grow p-4 flex flex-col space-y-2 overflow-y-auto">
            { elementSection }
        </div>
    )
}