import { useContext, useRef, useState } from "react";
import { AppContext } from "../../Context/AppContext";

import { faEllipsis, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Tasks from "./Tasks";

import api from "../../../Utils/ApiClient";
import useClickOutside from '../../../Hooks/useClickOutside';

export default function List({ list, removeList, board, setBoard }){
    const { accessToken } = useContext(AppContext)

    const [listTitle, setListTitle] = useState(list.name)
    const [focused, setFocused] = useState(false)
    const [optionsVisibility, setOptionsVisibility] = useState(false)

    let nameRef = useRef(null)

    const changeListTitle = async () => {
        if (listTitle === list.name) {
            return
        }

        const result = await api.patch(`/columns/${list.token}`, { name: listTitle }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            setBoard({
                ...board,
                lists: board.lists.map(mapList => {
                    return mapList.token === list.token
                        ? { ...list, name: listTitle }
                        : mapList
                })
            })

            return
        }

        setListTitle(list.name)
    }

    const handleListTitleChange = (e) => {
        if (e.key === 'Enter' || e.key === 'Escape'){
            e.target.blur()

            setFocused(false)
            changeListTitle()
        }
    }

    nameRef = useClickOutside(focused, () => {
        if (list.name !== listTitle) {
            setFocused(false)
            changeListTitle()
        }
    })

    return (
        <div className="board-list">
            <div className="relative w-full px-3 pr-2 py-2 flex items-center justify-between gap-1">
                <input 
                    ref={nameRef}
                    className="hybrid-input" 
                    value={listTitle}
                    onFocus={() => setFocused(true)}
                    onChange={(e) => setListTitle(e.target.value)}
                    onKeyDown={handleListTitleChange}
                />

                <button 
                    className="px-1 rounded-md transition-colors cursor-pointer hover:bg-[var(--secondary)]"
                    onClick={() => setOptionsVisibility(!optionsVisibility)}>
                    <FontAwesomeIcon icon={faEllipsis} size="md" className="text-[var(--octonary)]" />
                </button>
                
                <div className={ (!optionsVisibility ? 'hidden ' : '') + "absolute right-0 top-full w-full shadow-sm rounded-xs bg-[var(--secondary)] overflow-hidden"}>

                    <button 
                        className="w-full p-2 flex items-center cursor-pointer transition-colors hover:bg-[var(--tertiary)]"
                        onClick={() => removeList(list.token)}>
                        <FontAwesomeIcon icon={faTrash} className="text-[var(--red)]" />
                        <span className="grow text-sm text-[var(--octonary)] font-light">Delete list</span>
                    </button>

                </div>
            </div>
            
            <Tasks taskList={list.tasks} />

            <button className="w-full p-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer hover:bg-[var(--secondary)]">
                <FontAwesomeIcon icon={faPlus} size="md" className="text-[var(--octonary)]" />
                <span className="text-sm text-[var(--octonary)] font-light">Add a new task</span>
            </button>
        </div>
    )
}