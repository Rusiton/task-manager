import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";

import { faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import api from "../../../Utils/ApiClient";
import useClickOutside from '../../../Hooks/useClickOutside';
import { generateRandomString } from "../../../Utils/String";

import Tasks from "./Tasks";
import CreateTaskForm from "./CreateTaskForm";
import ListOptions from "./ListOptions";

export default function List({ list, removeList, board, setBoard }){
    const { accessToken, setModal } = useContext(AppContext)

    const [listTitle, setListTitle] = useState(list.name)
    const [focused, setFocused] = useState(false)

    const [optionsVisibility, setOptionsVisibility] = useState(false)

    const boardMemberList = [ ...board.members, board.owner ]

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



    const nameRef = useClickOutside(() => {
        if (list.name !== listTitle) {
            setFocused(false)
            changeListTitle()
        }
    }, focused)



    const handleTaskCreation = async (newTask = null) => {
        if (newTask) {
            // Creates a provitional task.
            setBoard({
                ...board,
                lists: board.lists.map(mapList => {
                    return mapList.token === list.token
                        ? { ...list, tasks: [...list.tasks, newTask] }
                        : mapList
                })
            })

            const result = await api.post('/tasks', newTask, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (result.success) {
                // Replaces the provisional task with the actual task from the database.
                setBoard({
                    ...board,
                    lists: board.lists.map(mapList => {
                        return mapList.token === list.token
                            ? {...mapList, tasks: [...list.tasks, result.data] }
                            : mapList
                    })
                })

                return
            }

            // Removes the provisional task if the request fails (Restores board to its previous value)
            setBoard(board)
            
            return 
        }

        setModal(
            <CreateTaskForm 
                boardMemberList={boardMemberList}
                list={list} 
                createHandler={handleTaskCreation} 
            />
        )
    }

    return (
        <div className="board-list">
            <div className="relative w-full px-3 pr-2 py-2 flex items-center justify-between gap-1">
                <input 
                    ref={nameRef}
                    id={generateRandomString()}
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
                
                
                <ListOptions visiblity={optionsVisibility} setVisibility={setOptionsVisibility} list={list} removeList={removeList} />

            </div>
            
            <div className="p-1 space-y-3 overflow-x-hidden overflow-y-auto">
                { list.tasks &&
                    <Tasks 
                        taskList={list.tasks} 
                        board={board} 
                        setBoard={setBoard} 
                    />
                }
            </div>

            <button 
                className="w-full p-2 rounded-md flex items-center gap-2 transition-colors cursor-pointer hover:bg-[var(--secondary)]"
                onClick={() => handleTaskCreation()}>
                <FontAwesomeIcon icon={faPlus} size="md" className="text-[var(--octonary)]" />
                <span className="text-sm text-[var(--octonary)] font-light">Add a new task</span>
            </button>
        </div>
    )
}