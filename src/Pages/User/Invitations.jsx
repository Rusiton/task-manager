import { useContext, useEffect, useState } from "react"
import { AppContext } from "../Context/AppContext"
import api from "../../Utils/ApiClient"
import InvtitationItem from "../Invitations/InvitationItem"

export default function Invitations() {
    const { user, accessToken } = useContext(AppContext)
    const [invitations, setInvitations] = useState([])
    const [fetchingData, setFetchingData] = useState(false)

    useEffect(() => {
        const getInvitations = async () => {
            setFetchingData(true)

            const result = await api.get('/boards/invitations', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            
            if (result.success) {
                setInvitations(result.data)
            }

            setFetchingData(false)
        }

        if (user && accessToken) getInvitations()
    }, [user, accessToken])

    return (
        <div className="page-container">
            <div className="w-full h-full shadow-md bg-[var(--secondary)] flex flex-col gap-2 justify-center">
                <div className="section-card h-full flex flex-col gap-2">
                    <h1 className="title text-[var(--octonary)]">Your invitations</h1>

                    <div className="pt-4 grow border-t border-[var(--tertiary)]">
                        { invitations.length > 0 && !fetchingData
                            ?
                            <ul>
                                {invitations.map(invitation => 
                                    <InvtitationItem key={invitation.token} invitation={invitation} setInvitations={setInvitations} />
                                )}
                            </ul>
                            :
                            <div>
                                No invitations received
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}