import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import api from "../../Utils/ApiClient";

export default function InvtitationItem({ invitation, setInvitations }) {
    const { accessToken } = useContext(AppContext)
    
    const acceptInvitation = async () => {
        const result = await api.post(`/boards/invitations/${invitation.token}/accept`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            setInvitations(prevInvitations => 
                prevInvitations.filter(invit => invit.token !== invitation.token)
            )
        }
    }

    const declineInvitation = async () => {
        const result = await api.post(`/boards/invitations/${invitation.token}/decline`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            setInvitations(prevInvitations => 
                prevInvitations.filter(invit => invit.token !== invitation.token)
            )
        }
    }

    return (
        <li className="shadow-md p-4 bg-[var(--secondary)] flex justify-between items-center">
            <div>
                <p className="text-[var(--septenary)] text-sm">
                    Sent by <span className="font-semibold">{invitation.invitedBy.name}</span>
                    <span className="ml-1 font-semibold italic text-xs">({invitation.invitedBy.email})</span>
                </p>

                <p className="text-[var(--septenary)] text-sm">
                    Expires on <span className="font-semibold">{new Date(invitation.expiresAt).toDateString()}</span>
                </p>

                <h2 className="mt-2 text-[var(--septenary)] text-lg">
                    Invited you to participate on <span className="font-semibold">'{invitation.board.name}'</span>
                </h2>
            </div>

            <div className="flex gap-2">
                <button 
                    className="shadow-md px-4 py-2 bg-[var(--green)] text-[var(--lightgray)] font-bold cursor-pointer transition-colors hover:bg-[var(--purple)]"
                    onClick={acceptInvitation}>
                    Accept
                </button>

                <button 
                    className="shadow-md px-4 py-2 bg-[var(--red)] text-[var(--lightgray)] font-bold cursor-pointer transition-colors hover:bg-[var(--quinary)]"
                    onClick={declineInvitation}>
                    Decline
                </button>
            </div>
        </li>
    )
}