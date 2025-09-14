import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

import BoardLists from "./Components/BoardLists";

import api from "../../Utils/ApiClient";

export default function Board() {
    const { accessToken, setLastRouteParameter } = useContext(AppContext)
    const { boardToken } = useParams()

    const [board, setBoard] = useState(null)
    const [boardTitleVisibility, setBoardTitleVisibility] = useState(true)

    useEffect(() => {
        setLastRouteParameter(' ')

        const getBoard = async () => {
            if (!accessToken || !boardToken) return

            const result = await api.get(`/boards/${boardToken}`, {
                headers: {
                    Authorization : `Bearer ${accessToken}`
                }
            })

            if (result.success) {
                setBoard(result.data)
                setLastRouteParameter(result.data.slug)
            }
        }

        getBoard()
    }, [accessToken, boardToken, setLastRouteParameter])

    return (
        <div className="page-container">
            <div className="relative flex">
                <div className={"section-card w-full overflow-hidden transition-all duration-150" + (boardTitleVisibility ? ' h-full' : ' h-0 py-0')}>
                    { board && 
                        <div className="w-full flex items-center">
                            <h1 className="title text-[var(--octonary)]">{ board.name }</h1>
                        </div>
                    }
                </div>

                { board && 
                    <button 
                        className={"absolute right-4 w-10 rounded bg-[var(--primary)] cursor-pointer transition-transform hover:bg-[var(--tertiary)]" + (!boardTitleVisibility ? ' translate-y-[0%] border-l border-b border-r rounded-t-none border-[var(--quinary)]' : ' translate-y-[110%]')}
                        onClick={() => setBoardTitleVisibility(!boardTitleVisibility)}>
                        <FontAwesomeIcon icon={boardTitleVisibility ? faAngleUp : faAngleDown} size="md" className="text-[var(--octonary)]" />
                    </button>
                }
            </div>

            <div className="section-card grow">
                { board && <>
                    <BoardLists board={board} setBoard={setBoard} />
                </>}
            </div>
        </div>
    )
}