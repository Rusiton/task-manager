import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus} from "@fortawesome/free-solid-svg-icons";

import List from "./List";

import api from "../../../Utils/ApiClient";
import { generateRandomString } from "../../../Utils/String";
import { generate } from "random-words";

export default function BoardLists({ board, setBoard }) {
    const { accessToken } = useContext(AppContext)



    const refreshColumnsPositions = (listToken) => {
        const newBoard = {
            ...board,
            // Filters out the current list, then refreshes all positions except for the current list.
            lists: board.lists.filter(mapList => mapList.token !== listToken).map(mapList => {
                return { ...mapList, position: (board.lists.indexOf(mapList) + 1) }
            })
        }

        setBoard(newBoard)
    }

    /**
     * List creation handler.
     */
    const handleListCreation = async () => {
        const existingTitles = board.lists.map(list => list.name)
        let title
        
        do {
            title = generate({ exactly: 2, join: "-" })
        } while (existingTitles.includes(title));

        // Creates a provisional list.
        setBoard(
            { ...board, lists: [...board.lists, { 
                name: title, 
                position: board.lists.length + 1, 
                tasks: [],
            }] 
        })

        const body = {
            boardToken: board.token,
            name: title,
            position: board.lists.length + 1,
        }

        const result = await api.post('/columns', body, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            // Removes the provisional list and replaces it with the actual list in the database.
            setBoard({
                ...board, 
                lists: board.lists.filter(list => list.name !== title)
            })
            
            setBoard(
                {...board, 
                    lists: [...board.lists, result.data]
            })
        } else {
            // Removes the provisional list.
            setBoard({...board, lists: board.lists.filter(list => list.name !== title)})
        }
    }


    /**
     * List deletion handler.
     */
    const handleListRemoval = async (token) => {
        const listToRemove = board.lists.find(list => list.token === token)

        setBoard({
            ...board,
            lists: board.lists.filter(list => list.token !== token)
        })

        refreshColumnsPositions(token)

        const result = await api.delete(`/columns/${token}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            return
        }

        // In case the list was not removed successfully from the database, it gets appended again to the list array.
        setBoard({
            ...board,
            lists: [...board.lists, listToRemove]
        })
    }
    

    return (
        <div className="w-full h-full p-2 rounded bg-[var(--secondary)] flex items-start gap-3 overflow-y-hidden overflow-x-auto">

            {board.lists.map(list => 
                <List 
                    key={generateRandomString()} 
                    list={list} 
                    removeList={handleListRemoval}
                    board={board}
                    setBoard={setBoard}
                />
            )}

            <button 
                className="w-56 min-w-56 p-4 border border-dashed border-[var(--octonary)] rounded-md bg-[var(--primary)] flex items-center justify-center gap-4 cursor-pointer select-none transition-colors hover:bg-[var(--tertiary)]"
                onClick={handleListCreation}>
                <FontAwesomeIcon icon={faCirclePlus} size="md" className="text-[var(--octonary)]" />
                <span className="w-full text-center text-sm text-[var(--octonary)] font-light">Create a new list</span>
            </button>

        </div>
    )
}