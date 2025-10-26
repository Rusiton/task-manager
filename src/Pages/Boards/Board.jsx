import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";

import Lists from "./Components/Lists";
import InvitationPanel from "./Components/InvitationPanel";

import useBoardWebsocket from "../../Hooks/useBoardWebsocket"
import api from "../../Utils/ApiClient";
import MembersPanel from "./Components/MembersPanel";

export default function Board() {
    const { user, accessToken, setLastRouteParameter, setModal } = useContext(AppContext)
    const { boardToken } = useParams()

    const [board, setBoard] = useState(null)
    const [isUserOwner, setIsUserOwner] = useState(false)
    const [isUserAdmin, setIsUserAdmin] = useState(false)

    const boardTokenRef = useRef(null)

    const [boardTitleVisibility, setBoardTitleVisibility] = useState(true)

    const navigate = useNavigate()


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
                
                setIsUserOwner(user.token === result.data.owner.token)
                setIsUserAdmin(() => {
                    const adminsTokens = result.data.admins.map(admin => admin.token)
                    return adminsTokens.includes(user.token)
                })

                boardTokenRef.current = result.data.token
            }
            else {
                navigate('/boards')
            }
        }

        getBoard()
    }, [boardToken])



    const openInvitationPanel = () => {
        setModal(
            <InvitationPanel
                accessToken={accessToken}
                board={board}
                setModal={setModal}
            />
        )
    }



    const openMembersPanel = () => {
        setModal(
            <MembersPanel
                isUserOwner={isUserOwner}
                isUserAdmin={isUserAdmin}
                board={board}
                setBoard={setBoard}
                setModal={setModal}
            />
        )
    }


    
    const { connected } = useBoardWebsocket(boardTokenRef.current, {
        onListCreated: ({column}) => {
            setBoard(prevBoard => {
                if (!prevBoard) return prevBoard

                const newState = {
                    ...prevBoard,
                    lists: [...prevBoard.lists, column]
                }

                return newState
            })
        },

        onListUpdated: ({column}) => {
            setBoard(prevBoard => {
                if (!prevBoard) return prevBoard

                const newState = {
                    ...prevBoard,
                    lists: prevBoard.lists.map(mapList => mapList.token !== column.token
                        ? mapList
                        : {...column}
                    )
                }

                return newState
            })
        },

        onListDeleted: ({column}) => {
            setBoard(prevBoard => {
                if (!prevBoard) return prevBoard

                const listToRemove = prevBoard.lists.find(list => list.token === column)

                // If there is not any list to remove at all
                if (!listToRemove) return prevBoard

                const newState = {
                    ...prevBoard,
                    lists: 
                        prevBoard.lists.filter(filterList => filterList.token !== column)
                        .map(mapList => mapList.position < listToRemove.position
                            ? mapList
                            : {...mapList, position: mapList.position - 1}
                        )
                }

                return newState
            })
        },

        onTaskCreated: ({task}) => {
            setBoard(prevBoard => {
                if (!prevBoard) return

                // Check if the task is already moved to prevent duplicates
                if (prevBoard.lists.find(list => list.token === task.columnToken)
                    .tasks.find(findTask => findTask.token === task.token)) 
                    return

                const newState = {
                    ...prevBoard,
                    lists: prevBoard.lists.map(mapList => mapList.token !== task.columnToken
                        ? mapList
                        : { ...mapList, tasks: [...mapList.tasks, task] }
                    )
                }

                return newState
            })
        },

        onTaskMovedWithinColumn: ({column, tasks}) => {
            setBoard(prevBoard => {
                if (!prevBoard) return prevBoard

                const newState = {
                    ...prevBoard,
                    lists: prevBoard.lists.map(mapList => mapList.token !== column
                        ? mapList
                        : {...mapList, tasks: tasks}
                    )
                }

                return newState
            })
        },

        onTaskMovedToColumn: ({task, previousColumn, previousPosition}) => {
            setBoard(prevBoard => {
                if (!prevBoard) return

                // Check if the task is already moved to prevent duplicates
                if (prevBoard.lists.find(list => list.token === task.columnToken)
                    .tasks.find(findTask => findTask.token === task.token)) 
                    return prevBoard
                
                // Removes the moved task from its previous column
                const filteredPreviousTaskList = 
                    prevBoard.lists.find(list => list.token === previousColumn)
                    .tasks.filter(filterTask => filterTask.token !== task.token)

                // Orders the previous column so there is no gaps between tasks positions
                const previousTaskList = 
                    filteredPreviousTaskList
                    .map(mapTask => mapTask.position < previousPosition
                        ? mapTask
                        : {...mapTask, position: filteredPreviousTaskList.indexOf(mapTask) + 1}
                    )
                
                const newTaskList = [
                    ...prevBoard.lists.find(list => list.token === task.columnToken)
                    .tasks.map(mapTask => mapTask.position < task.position
                        ? mapTask
                        : {...mapTask, position: mapTask.position + 1} 
                        // Increments each task that is at the same or a higher position than the new task by 1 in order to leave an empty slot for it to be inserted in
                    ),
                    task // Inserts the task at the last index
                ].sort((a, b) => a.position - b.position) // Sorts tasks by their position value
                
                const newState = {
                    ...prevBoard,
                    lists: prevBoard.lists.map(list => list.token !== previousColumn && list.token !== task.columnToken
                        ? list : (list.token === previousColumn
                            ? {...list, tasks: previousTaskList}
                            : {...list, tasks: newTaskList}
                        )
                    )
                }

                return newState
            })
        },

        onTaskUpdated: (data) => {
            setBoard(prevBoard => {
                if (!prevBoard) return

                return {
                    ...prevBoard,
                    lists: prevBoard.lists.map(mapList => mapList.token !== data.task.columnToken
                        ? mapList
                        : {...mapList, tasks: mapList.tasks.map(mapTask => mapTask.token !== data.task.token
                            ? mapTask
                            : data.task
                        ) }
                    )
                }
            })
        },

        onTaskDeleted: ({column, task}) => {
            setBoard(prevBoard => {
                if (!prevBoard) return

                const list = prevBoard.lists.find(list => list.token === column)
                const taskToRemove = list.tasks.find(findTask => findTask.token === task)

                // If there is not any task to remove at all.
                if (!taskToRemove) return prevBoard

                const newTaskList = 
                    list.tasks.filter(filterTask => filterTask.token !== task)
                    .map(mapTask => mapTask.position < taskToRemove.position
                        ? mapTask
                        : {...mapTask, position: mapTask.position - 1}
                    )
                
                const newState = {
                    ...prevBoard,
                    lists: prevBoard.lists.map(mapList => mapList.token !== column
                        ? mapList
                        : {...mapList, tasks: newTaskList}
                    )
                }

                return newState
            })
        },
    })



    return (
        <div className="page-container">
            <div className={"relative flex" + (!boardTitleVisibility ? ' m-0' : '')}>
                <div className={"section-card pr-16 w-full flex overflow-hidden transition-all duration-150" + (boardTitleVisibility ? ' h-full' : ' h-0 py-0')}>
                    { board && 
                        <>
                            <div className="w-full flex items-center">
                                <h1 className="title text-[var(--octonary)]">{ board.name }</h1>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <button 
                                    className="p-2 rounded-lg cursor-pointer outline-[var(--blue)] transition-colors hover:bg-[var(--secondary)] hover:outline hover:shadow-md"
                                    onClick={openMembersPanel}>
                                    <FontAwesomeIcon icon={faUsers} size="lg" className="text-[var(--octonary)]" />
                                </button>

                                {(isUserOwner || isUserAdmin) &&
                                    <button 
                                        className="p-2 rounded-lg cursor-pointer outline-[var(--blue)] transition-colors hover:bg-[var(--secondary)] hover:outline hover:shadow-md"
                                        onClick={openInvitationPanel}>
                                        <FontAwesomeIcon icon={faUserPlus} size="lg" className="text-[var(--octonary)]" />
                                    </button>
                                }
                            </div>
                        </>
                    }
                </div>

                { board && 
                    <button 
                        className={"absolute right-4 w-10 rounded bg-[var(--primary)] outline-[var(--blue)] cursor-pointer transition-all hover:bg-[var(--secondary)] hover:outline" + (!boardTitleVisibility ? ' translate-y-[0%] border-l border-b border-r rounded-t-none border-[var(--quinary)]' : ' translate-y-[110%]')}
                        onClick={() => setBoardTitleVisibility(!boardTitleVisibility)}>
                        <FontAwesomeIcon icon={boardTitleVisibility ? faAngleUp : faAngleDown} size="md" className="text-[var(--octonary)]" />
                    </button>
                }
            </div>

            <div className="section-card grow min-h-0">
                { board && <>
                    <Lists board={board} setBoard={setBoard} isUserOwner={isUserOwner} isUserAdmin={isUserAdmin} />
                </>}
            </div>
        </div>
    )
}