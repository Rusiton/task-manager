import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";

import api from "../../../Utils/ApiClient";

import Input from "../../Components/Input";
import Textarea from "../../Components/Textarea";
import DateInput from "../../Components/DateInput";
import CloseModalButton from "../../Components/CloseModalButton";
import ExpandedTaskOptions from "./ExpandedTaskOptions";
import Select from "../../Components/Select";

export default function ExpandedTask({ task, board, setBoard }) {
    const { accessToken, setModal } = useContext(AppContext)
    const [mode, setMode] = useState('display') // or 'edit'

    const [formData, setFormData] = useState({
        columnToken: task.columnToken,
        assignedTo: task.assignedTo,
        name: task.name,
        description: task.description,
        position: task.position,
        dueDate: task.dueDate,
    })

    const boardMemberList = [ ...board.members, board.owner ]



    const refreshTasksPositions = () => {
        const newBoard = {
            ...board,
            // Filters out the current task, then refreshes all positions except for the current task.
            lists: board.lists.map(mapList => ({ ...mapList, tasks: mapList.tasks.filter(mapTask => mapTask.token !== task.token).map(mapTask => {
                return { ...mapTask, position: (mapList.tasks.filter(mapTask => 
                    mapTask.token !== task.token).indexOf(mapTask) + 1) // Gets task position within the task list
                }
            })}))
        }

        setBoard(newBoard)
    }



    const handleUpdateCancel = () => {
        setFormData({
            columnToken: task.columnToken,
            assignedTo: task.assignedTo,
            name: task.name,
            description: task.description,
            position: task.position,
            dueDate: task.dueDate,
        })

        setMode('display')
    }



    const handleTaskRemoval = async () => {
        // Removes current task
        setBoard({
            ...board,
            lists: board.lists.map(mapList => !mapList.tasks.includes(task)
                ? mapList
                : { ...mapList, tasks: mapList.tasks.filter(mapTask => mapTask !== task) }
            )
        })

        // Updates other task's position
        refreshTasksPositions()

        setModal(null)

        const result = await api.delete(`/tasks/${task.token}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (!result.success) {
            setBoard(board)
        }
    }



    const handleInputChange = (value, key) => {
        setFormData({
            ...formData,
            [key]: value,
        })
    }



    const validateValues = (valuesObject) => {
        Object.keys(valuesObject).map(key => {
            const { value, maxLength, ignoreValue, ignoreMaxLength } = valuesObject[key]
            
            if (!ignoreValue && (!value || value === '')) throw new Error(`${key}: Empty value.`)
            if (!ignoreMaxLength && (value.length > maxLength)) throw new Error(`${key}: Exceeded max character limit.`)
        })
    }



    const handleTaskUpdate = async (e) => {
        e.preventDefault()

        let hasDataChanged = false

        Object.keys(formData).forEach(key => {
            if (formData[key] !== task[key]) hasDataChanged = true
        })

        if (!hasDataChanged) {
            setMode('display')
            return
        }
        
        validateValues({
            columnToken: {value: formData.columnToken, maxLength: null, ignoreValue: false, ignoreMaxLength: true},
            name: {value: formData.name, maxLength: 80, ignoreValue: false, ignoreMaxLength: false},
            description: {value: formData.description, maxLength: 400, ignoreValue: true, ignoreMaxLength: !formData.description ? true: false},
            position: {value: formData.position, maxLength: null, ignoreValue: false, ignoreMaxLength: true},
        })

        const updatedTaskList = 
            board.lists.find(list => list.token === task.columnToken).tasks.map(mapTask => mapTask.token !== task.token
                ? mapTask
                : {
                    columnToken: formData.columnToken,
                    assignedTo: formData.assignedTo,
                    name: formData.name,
                    description: formData.description,
                    position: formData.position,
                    dueDate: formData.dueDate,
                }
            )
        
        setBoard({
            ...board,
            lists: board.lists.map(mapList => mapList.token !== task.columnToken
                ? mapList
                : { ...mapList, tasks: updatedTaskList}
            )
        })
        
        setModal(null)

        const mappedFormData = { 
            ...formData, 
            assignedTo: formData.assignedTo 
                ? formData.assignedTo.token ? formData.assignedTo.token : formData.assignedTo 
                : null
        }

        const result = await api.put(`/tasks/${task.token}`, mappedFormData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            setBoard({
                ...board,
                lists: board.lists.map(mapList => mapList.token !== task.columnToken
                    ? mapList
                    : { ...mapList, tasks: mapList.tasks.map(mapTask => mapTask.token !== task.token
                        ? mapTask
                        : result.data
                    )}
                )
            })
        }
        else {
            setBoard(board)
        }
    }



    return (
        <div className="shadow-md overflow-hidden w-3/4 max-w-[700px] h-96 rounded-md bg-[var(--primary)] flex flex-col">
            <div className="shadow-md w-full p-3 flex items-center justify-between">
                <p className="text-[var(--octonary)] select-none">
                    { task.name }
                </p>

                <div className="flex gap-2">
                    <ExpandedTaskOptions 
                        mode={mode} 
                        setMode={setMode}
                        removeTask={handleTaskRemoval} 
                        cancelUpdate={handleUpdateCancel} 
                        saveChanges={handleTaskUpdate} 
                    />

                    <CloseModalButton setModal={setModal} />
                </div>
            </div>

            <div className="w-full grow p-3 flex gap-4">
                <div className={"flex-1 flex flex-col " + (mode === 'display' ? 'gap-4' : '')}>
                    <div>
                        <Input 
                            value={formData.name}
                            name="taskName"
                            placeholder="Title"
                            maxLength={80}
                            parentHandler={handleInputChange}
                            parentObjectKey="name"
                            required={true}
                            disabled={mode === 'display'}
                        />
                    </div>

                    <div className="grow flex flex-col">
                        <Textarea
                            value={formData.description ? formData.description : ''}
                            name="taskDescription"
                            placeholder="Description"
                            maxLength={400}
                            parentHandler={handleInputChange}
                            parentObjectKey="description"
                            required={false}
                            disabled={mode === 'display'}
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    { formData.assignedTo ?
                        <div>
                            { mode === 'display' ?
                                <>
                                    <label htmlFor={'assignedTo-disabled'} className="text-[var(--octonary)]">Assigned to</label>
                                    <input 
                                        type="text"
                                        id="assignedTo-disabled"
                                        name="assignedTo" 
                                        className="text-input"
                                        value={formData.assignedTo.name}
                                        disabled={true}
                                    />
                                </>
                                :
                                <Select 
                                    value={formData.assignedTo.token}
                                    name="taskAssignedTo"
                                    placeholder="Assigned to (Optional)"
                                    optionList={boardMemberList}
                                    parentHandler={handleInputChange}
                                    parentObjectKey="assignedTo"
                                    required={false}
                                />
                            }
                        </div>
                        :
                        <div>
                            { mode === 'display' ?
                                <>
                                    <label htmlFor={'assignedTo-disabled'} className="text-[var(--octonary)]">Assigned to</label>
                                    <input 
                                        type="text"
                                        id="assignedTo-disabled"
                                        name="dueDate" 
                                        className="text-input"
                                        value="No one"
                                        disabled={true}
                                    />
                                </>
                                :
                                <Select 
                                    name="taskAssignedTo"
                                    placeholder="Assigned to (Optional)"
                                    optionList={boardMemberList}
                                    parentHandler={handleInputChange}
                                    parentObjectKey="assignedTo"
                                    required={false}
                                />
                            }
                        </div>
                    }

                    { formData.dueDate ?
                        <div>
                            <DateInput
                                value={formData.dueDate}
                                name="taskDueDate"
                                placeholder="Due until"
                                parentHandler={handleInputChange}
                                parentObjectKey="dueDate"
                                required={false}
                                disabled={mode === 'display'}
                            />
                        </div>
                        : 
                        <div>
                            { mode === 'display' ?
                                <>
                                    <label htmlFor={'dueDate-disabled'} className="text-[var(--octonary)]">Due until</label>
                                    <input 
                                        type="text"
                                        id="dueDate-disabled"
                                        name="dueDate" 
                                        className="text-input"
                                        value="-"
                                        disabled={true}
                                    />
                                </>
                                :
                                <>
                                    <DateInput
                                        value={formData.dueDate ? formData.dueDate : ''}
                                        name="taskDueDate"
                                        placeholder="Due until"
                                        parentHandler={handleInputChange}
                                        parentObjectKey="dueDate"
                                        required={false}
                                        disabled={false}
                                    />
                                </>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}