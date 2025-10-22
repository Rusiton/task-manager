import { useEffect, useState } from "react";
import { faCheck, faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Searchbar from "../../Components/Searchbar";
import api from "../../../Utils/ApiClient";
import UserListItem from "./UserListItem";
import { addDays, getCurrentDateTimeFormatted } from "../../../Utils/String";

export default function InvitationPanel({ accessToken, board, setModal }) {
    const [searchValue, setSearchValue] = useState('')
    const [searchingState, setSearchingState] = useState(false) 
    const [searchResults, setSearchResults] = useState(false)
    const [timesSearched, setTimesSearched] = useState(0)

    const optionButtons = [
        { text: 'Invite', styles: 'bg-[var(--green)] text-[var(--octonary)]', callback: (userToken) => inviteUser(userToken) }
    ]

    const [invitationSuccess, setInvitationSuccess] = useState(false)

    const inviteUser = async (userToken) => {
        const expiresAt = getCurrentDateTimeFormatted(
            addDays(new Date(), 15)
        )

        const result = await api.post(`/boards/${board.token}/invitations`, {
            'userToken': userToken,
            'expiresAt': expiresAt,
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (result.success) {
            setSearchResults(searchResults.filter(result => result.token !== userToken))
            setInvitationSuccess(true)
        }
    }



    useEffect(() => {
        const getUsers = async () => {
            const result = await api.get(`/users/search/${searchValue}?excludeFromBoard=${board.token}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (result.success) {
                setSearchResults(result.data)
                setTimesSearched(prevTime => prevTime + 1)
            }

            setSearchingState(false)
        }

        const canSearch = (searchValue && searchValue.length > 0)

        if (canSearch) { 
            setSearchingState(true) 
        } else {
            setTimesSearched(0)
            setSearchingState(false)
        }

        const timer = setTimeout(() => {
            if (canSearch) getUsers()
        }, 1000);

        return () => clearTimeout(timer)
    }, [searchValue])



    useEffect(() => {
        const removeMessageTimeout = setTimeout(() => {
            if (invitationSuccess) setInvitationSuccess(false)
        }, 3000);

        return () => clearTimeout(removeMessageTimeout)
    }, [invitationSuccess])



    return (
        <div className="relative shadow-md overflow-hidden w-3/4 max-w-[700px] h-96 rounded-md bg-[var(--primary)] flex flex-col">

            <div className={`absolute bottom-6 w-full flex justify-center transition-all duration-300 ${invitationSuccess ? 'opacity-100' : 'opacity-0'}`}>
                <div className="px-4 pl-0 rounded-full bg-[var(--tertiary)] text-sm text-[var(--septenary)] flex items-center gap-2">
                    <span className="w-10 h-10 rounded-full bg-[var(--green)] grid place-content-center">
                        <FontAwesomeIcon icon={faCheck} size="lg" className="text-[var(--lightgray)]"/>
                    </span>
                    <p>
                        Invitation was sent successfully
                    </p>
                </div>
            </div>

            <div className="shadow-md w-full p-3 flex items-center justify-between">
                <p className="text-[var(--octonary)] font-light select-none">
                    Invite a new user
                </p>
                <button 
                    className="w-10 p-1 rounded-md cursor-pointer transition-colors hover:bg-[var(--secondary)]"
                    onClick={() => setModal(null)}>
                    <FontAwesomeIcon icon={faXmark} className="text-[var(--octonary)]" />
                </button>
            </div>

            <div className="w-full min-h-0 grow p-3 flex flex-col">

                <div className="w-full h-12">
                    <Searchbar 
                        placeholder={'Search by username or email'}
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                    />
                </div>

                <div className="mt-2 pt-2 w-full min-h-0 grow border-t border-[var(--quaternary)]">
                    { searchingState
                        ? 
                        <div className="w-full h-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faCircleNotch} spin className="text-[var(--septenary)]" />
                            </div>
                        :
                        ( searchResults.length > 0
                            ?
                            <ul className="w-full max-h-full flex flex-col gap-2 overflow-y-auto">
                                { searchResults.map(user => 
                                    <UserListItem key={user.token} user={user} optionButtons={optionButtons} />
                                )}
                            </ul>
                            :
                            ( timesSearched !== 0
                                &&
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="text-sm font-light text-[var(--septenary)]">Oops! We weren't able to retrieve any user. Maybe try with some other values?</p>
                                </div>
                            )
                        )
                    }
                </div>

            </div>
        </div>
    )
}