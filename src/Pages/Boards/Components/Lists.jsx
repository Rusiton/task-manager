import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus} from "@fortawesome/free-solid-svg-icons";

import List from "./List";

import api from "../../../Utils/ApiClient";
import { generate } from "random-words";
import { closestCorners, DndContext, DragOverlay, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { generateRandomString } from "../../../Utils/String";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Task from "./Task";

export default function Lists({ board, setBoard }) {
    const { accessToken } = useContext(AppContext)
    
    const [draggingId, setDraggingId] = useState(null)
    const [draggingType, setDraggingType] = useState(null)


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


    const getTask = (token) => {
        let task

        board.lists.forEach(mapList => mapList.tasks.forEach(mapTask => {
            if (mapTask.token === token) task = mapTask
        }))

        return task
    }


    const handleDragStart = event => {
        setDraggingId(event.active.id)
        setDraggingType(event.active.data.current?.type || 'task')
    }


    const handleDragEnd = async event => {
        setDraggingId(null);
        setDraggingType(null);
        const { active, over } = event
        
        if (active.id === over.id) return

        const draggedTask = getTask(active.id)
        const droppedOnTask = getTask(over.id)

        // Changes dragged task position
        setBoard({
            ...board,
            lists: board.lists.map(mapList => { return mapList.token !== draggedTask.columnToken
                ? mapList
                : { ...mapList, tasks: arrayMove(mapList.tasks, draggedTask.position - 1, droppedOnTask.position - 1)
                    .map(mapTask => {
                    return { 
                        ...mapTask, 
                        position: arrayMove(mapList.tasks, draggedTask.position - 1, droppedOnTask.position - 1).indexOf(mapTask) + 1 
                    }}
                )}
            })
        })
    }


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        }),
    )
    

    return (
        <div className="w-full h-full p-2 rounded bg-[var(--secondary)] flex items-start gap-3 overflow-y-hidden overflow-x-auto">

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                {board.lists.map(list => 
                    <List 
                        key={list.token ? list.token : generateRandomString()} 
                        list={list} 
                        removeList={handleListRemoval}
                        board={board}
                        setBoard={setBoard}
                    />
                )}

                <DragOverlay>
                    { draggingId ? (
                        draggingType === 'task' && (
                            <Task 
                                task={getTask(draggingId)}
                                board={board}
                                setBoard={setBoard}
                            />
                        )
                    ): null}
                </DragOverlay>
            </DndContext>

        <button 
            className="w-56 min-w-56 p-4 border border-dashed border-[var(--octonary)] rounded-md bg-[var(--primary)] flex items-center justify-center gap-4 cursor-pointer select-none transition-colors hover:bg-[var(--tertiary)]"
            onClick={handleListCreation}>
            <FontAwesomeIcon icon={faCirclePlus} size="md" className="text-[var(--octonary)]" />
            <span className="w-full text-center text-sm text-[var(--octonary)] font-light">Create a new list</span>
        </button>

        </div>
    )
}