import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useParams } from "react-router-dom";
import api from "../../Utils/ApiClient";

import AffiliatedProfileDescription from "./Components/AffiliatedProfileDescription";
import UnaffiliatedProfileDescription from "./Components/UnaffiliatedProfileDescription";
import UserNotFoundCard from "./Components/UserNotFoundCard";

export default function Profile() {
    const { user, accessToken } = useContext(AppContext)
    const { username } = useParams()

    const [queriedUser, setQueriedUser] = useState(null)
    const [isUserSameAsQueriedUser, setIsUserSameAsQueriedUser] = useState(false)
    const [userNotFound, setUserNotFound] = useState(false)

    useEffect(() => {
        async function getUser() {
            const result = await api.get(`/auth/users/${username}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (result.success) {
                setQueriedUser(result.data)
                setUserNotFound(false)
            } else {
                setUserNotFound(true)
            }
        }

        if (user) {
            user.name == username
                ? (
                    setQueriedUser(user), 
                    setIsUserSameAsQueriedUser(true),
                    setUserNotFound(false)
                )
                : getUser()
        }
    }, [user, username, accessToken])

    return (
        <div className="h-full p-4 space-y-2 flex flex-col">
            
            {queriedUser && <>

                {/* If the current user is the same as the queried user */}
                {isUserSameAsQueriedUser && <AffiliatedProfileDescription queriedUser={queriedUser} />}

                {/* If the current user is not the same as the queried user */}
                {!isUserSameAsQueriedUser && <UnaffiliatedProfileDescription queriedUser={queriedUser} />}
            
            </>}

            {userNotFound && <UserNotFoundCard />}
            
        </div>
    )
}