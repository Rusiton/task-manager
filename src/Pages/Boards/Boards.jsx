import { useContext, useEffect, useState } from "react"
import { AppContext } from "../Context/AppContext"
import api from "../../Utils/ApiClient"
import UserBoards from "../Components/UserBoards"
import LoadingBoards from "../Components/LoadingBoards"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

export default function Boards() {
    const { user, accessToken } = useContext(AppContext)

    const [boards, setBoards] = useState(null)

    useEffect(() => {
        setBoards(null)
        
        async function getBoards() {

            const result = await api.get(`/boards`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (result.success) {
                setBoards(result.data)
            }
        }

        getBoards()
    }, [accessToken, user])
    
    return (
        <div className="page-container">
            <div className="section-card space-y-4">
                <h2 className="section-label">Boards that you own</h2>
                <div className="flex flex-wrap items-stretch gap-2">
                    { boards 
                        ? <>
                            <Link to={'/boards/new'} className="h-20">
                                <div className="w-36 h-full border border-dashed border-[var(--octonary)] rounded flex flex-wrap content-center justify-center space-y-2 select-none transition hover:bg-[var(--secondary)] hover:shadow-md">
                                    <FontAwesomeIcon icon={faCirclePlus} size="lg" className="text-[var(--octonary)]" />
                                    <p className="w-full text-center text-xs text-[var(--octonary)] font-light">Create a new Board</p>
                                </div>
                            </Link>

                            <UserBoards boardList={boards.ownedBoards} style="card" />
                        </> : <LoadingBoards style="card" />
                    }
                </div>
            </div>
            <div className="section-card space-y-4">
                <h2 className="section-label">Boards where you are participating</h2>
                <div className="my-2 flex flex-wrap gap-2">
                    { boards 
                        ? <UserBoards boardList={boards.joinedBoards} style="card" />
                        : <LoadingBoards style="card" />
                    }
                </div>
            </div>
        </div>
    )
}