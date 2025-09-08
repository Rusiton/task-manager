import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useParams } from "react-router-dom";
import api from "../../Utils/ApiClient";

export default function Profile() {
    const { user, accessToken } = useContext(AppContext)
    const { username } = useParams()

    const [queriedUser, setUser] = useState(null)
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
                setUser(result.data)
            } else {
                setUserNotFound(true)
            }
        }

        if (user) {
            user == username
                ? (setUser(user), setIsUserSameAsQueriedUser(true))
                : getUser()
        }
    }, [user, username, accessToken])

    return (
        <div className="p-4 space-y-2">
            
            {queriedUser && <>

                {/* If the current user is the same as the queried user */}
                {isUserSameAsQueriedUser && <>

                    <div className="p-4 flex items-center bg-[var(--primary)] shadow-md">
                        <div>
                            <h1 className="title font-semibold">
                                Welcome, {queriedUser.profile.name ? queriedUser.profile.name : queriedUser.name}.
                                </h1>
                            <h2 className="text-sm font-light text-[var(--septenary)]">
                                {queriedUser.profile.name ? '@' + queriedUser.name : queriedUser.email}
                                </h2>
                            <p className="text-sm italic">{queriedUser.profile.biography}</p>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="float w-32 h-32 bg-gray-800 rounded-full">
                                
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="w-1/4 min-w-42 p-4 bg-[var(--primary)] shadow-md">

                        </div>

                        <div className="flex-1 p-4 bg-[var(--primary)] shadow-md">

                        </div>
                    </div>

                </>}

                {/* If the current user is not the same as the queried user */}
                {!isUserSameAsQueriedUser && <>
                    
                    <div className="p-4 flex items-center bg-[var(--primary)] shadow-md">
                        <div>
                            <h1 className="title font-semibold">
                                {queriedUser.profile.name ? queriedUser.profile.name : queriedUser.name}.
                                </h1>
                            <h2 className="text-sm font-light text-[var(--septenary)]">
                                {queriedUser.name && '@' + queriedUser.name}
                                </h2>
                            <p className="text-sm italic">{queriedUser.profile.biography}</p>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="float w-32 h-32 bg-gray-800 rounded-full">
                                
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="w-1/4 min-w-42 p-4 bg-[var(--primary)] shadow-md">

                        </div>

                        <div className="flex-1 p-4 bg-[var(--primary)] shadow-md">

                        </div>
                    </div>

                </>}
            
            </>}
            
        </div>
    )
}