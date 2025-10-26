import { useContext, useEffect, useState } from "react"
import MemberManagementOptions from "./MemberManagementOptions"
import { AppContext } from "../../Context/AppContext"

export default function MemberRow({ board, setBoard, member, isUserOwner, isUserAdmin, setModal }) {
    const { user } = useContext(AppContext)

    const [role, setRole] = useState('')
    const [roleDisplayStyle, setRoleDisplayStyle] = useState('')

    useEffect(() => {
        if (board.owner.token === member.token) {
            setRole('Owner')
            return
        }

        if (board.admins.map(admin => admin.token).includes(member.token)) {
            setRole('Admin')
            return
        }

        if (board.members.map(mapMember => mapMember.token).includes(member.token)) {
            setRole('Member')
            return
        }
    }, [])

    useEffect(() => {
        if (role === 'Owner') setRoleDisplayStyle('bg-[var(--purple)]')
        if (role === 'Admin') setRoleDisplayStyle('bg-[var(--blue)]')
        if (role === 'Member') setRoleDisplayStyle('bg-[var(--green)]')                    
    }, [role])
    
    return (
        <div className="shadow-md w-full rounded-md px-4 py-2 bg-[var(--secondary)] flex justify-evenly">
            <div className="w-1/3 overflow-hidden">
                <p className="text-sm text-[var(--octonary)] break-words">{member.name}</p>
                <p className="text-xs text-[var(--septenary)] italic break-words">{member.email}</p>
            </div>

            <div className="w-1/3 flex items-center justify-center">
                <span className={`shadow-md min-w-20 px-3 py-2 rounded text-xs text-center text-[var(--lightgray)] font-bold ${roleDisplayStyle}`}>
                    {role}
                </span>
            </div>

            <div className="relative w-1/3 flex items-center justify-center gap-2">
                { ((isUserOwner || isUserAdmin) && (member.token !== board.owner.token) && (member.token !== user.token)) && <>
                    <MemberManagementOptions 
                        member={member}
                        board={board}
                        setBoard={setBoard}
                        setModal={setModal}
                    />
                </>}
            </div>
        </div>
    )
}