import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../../Context/AppContext"
import useClickOutside from "../../../Hooks/useClickOutside"
import api from "../../../Utils/ApiClient"

export default function MemberManagementOptions({ member, board, setBoard, setModal={setModal} }) {
    const { accessToken } = useContext(AppContext)

    const [open, setOpen] = useState(false)
    const [isMemberAdmin, setIsMemberAdmin] = useState()
    
    const openerRef = useRef()

    const optionsRef = useClickOutside(() => {
        setOpen(false)
    }, true, openerRef.current)
    

    useEffect(() => {
        setIsMemberAdmin(
            board.admins.map(admin => admin.token)
            .includes(member.token)
        )
    }, [])


    const promoteMember = async () => {
        const result = await api.put(`/boards/${board.token}/members/${member.token}/setRole`, {
            role: 'admin',
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            setOpen(false)

            setModal(null)

            setBoard(prevBoard => {
                return {
                    ...prevBoard,
                    admins: [...prevBoard.admins, member],
                }                
            })
        }
    }


    const demoteMember = async () => {
        const result = await api.put(`/boards/${board.token}/members/${member.token}/setRole`, {
            role: 'member',
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            setOpen(false)

            setModal(null)

            setBoard(prevBoard => {
                return {
                    ...prevBoard,
                    admins: prevBoard.admins.filter(mapMember => mapMember.token !== member.token),
                }       
            })
        }
    }


    const kickMember = async () => {
        const result = await api.delete(`/boards/${board.token}/members/${member.token}/kick`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            setOpen(false)

            setModal(null)

            setBoard(prevBoard => {
                return {
                    ...prevBoard,
                    admins: prevBoard.admins.filter(mapMember => mapMember.token !== member.token),
                    members: prevBoard.members.filter(mapMember => mapMember.token !== member.token),
                }                
            })
        }
    }


    return (
        <>
            <button 
                ref={openerRef}
                className="underline text-xs text-[var(--octonary)] cursor-pointer hover:text-[var(--purple)]"
                onClick={() => setOpen(!open)}>
                Manage
            </button>

            <ul ref={optionsRef} className={`${open ? 'block' : 'hidden'} absolute top-full z-10 min-w-32 shadow-lg border-1 border-t-0 border-[var(--tertiary)] p-2 bg-[var(--secondary)]`}>
                <li>
                    { isMemberAdmin
                        ? 
                        <button className="w-full px-2 py-1 font-semibold text-sm text-[var(--red)] text-center cursor-pointer transition-colors hover:bg-[var(--tertiary)]" onClick={demoteMember}>
                            Demote to member
                        </button>
                        : 
                        <button className="w-full px-2 py-1 font-semibold text-sm text-[var(--green)] text-center cursor-pointer transition-colors hover:bg-[var(--tertiary)]" onClick={promoteMember}>
                            Promote to admin
                        </button>
                    }
                </li>
                <li>
                    <button className="w-full px-2 py-1 font-semibold text-sm text-[var(--red)] text-center cursor-pointer transition-colors hover:bg-[var(--tertiary)]" onClick={kickMember}>
                        Kick user
                    </button>
                </li>
            </ul>
        </>
    )
}