import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Input from "../../Components/Input";
import Textarea from "../../Components/Textarea";
import Select from "../../Components/Select";
import DateInput from "../../Components/DateInput";

export default function CreateTaskForm({ boardMemberList, list, createHandler }) {
    const { setModal } = useContext(AppContext)

    const [formData, setFormData] = useState({
        columnToken: list.token,
        assignedTo: '',
        name: '',
        description: '',
        position: list.tasks.length + 1,
        dueDate: '',
    })

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

    const handleSubmit = (e) => {
        e.preventDefault()
        
        validateValues({
            columnToken: {value: formData.columnToken, maxLength: null, ignoreValue: false, ignoreMaxLength: true},
            name: {value: formData.name, maxLength: 80, ignoreValue: false, ignoreMaxLength: false},
            description: {value: formData.description, maxLength: 400, ignoreValue: true, ignoreMaxLength: false},
            position: {value: formData.position, maxLength: null, ignoreValue: false, ignoreMaxLength: true},
        })

        createHandler(formData)
        setModal(null)
    }

    return (
        <div className="shadow-md overflow-hidden w-3/4 max-w-[700px] h-96 rounded-md bg-[var(--primary)] flex flex-col">
            <div className="shadow-md w-full p-3 flex items-center justify-between">
                <p className="text-[var(--octonary)] font-light select-none">
                    Creating new task for: 
                    <span className="ml-4 underline text-sm">{list.name}</span>
                </p>
                <button 
                    className="w-10 p-1 rounded-md cursor-pointer transition-colors hover:bg-[var(--secondary)]"
                    onClick={() => setModal(null)}>
                    <FontAwesomeIcon icon={faXmark} className="text-[var(--octonary)]" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="w-full grow p-3 flex gap-4">

                <div className="flex-1 flex flex-col">
                    <div>
                        <Input 
                            name="taskName"
                            placeholder="Task name"
                            maxLength={80}
                            parentHandler={handleInputChange}
                            parentObjectKey="name"
                            required={true}
                        />
                    </div>
                    <div className="grow flex flex-col">
                        <Textarea 
                            name="taskDescription"
                            placeholder="Task description (Optional)"
                            maxLength={400}
                            parentHandler={handleInputChange}
                            parentObjectKey="description"
                            required={false}
                        />
                    </div>
                </div>

                <div className="flex-1 max-h-full flex flex-col">
                    <div className="grow flex flex-col gap-7 overflow-y-auto">
                        <div>
                            <Select 
                                name="taskAssignedTo"
                                placeholder="Assigned to (Optional)"
                                optionList={boardMemberList}
                                parentHandler={handleInputChange}
                                parentObjectKey="assignedTo"
                                required={false}
                            />
                        </div>

                        <div>
                            <DateInput 
                                name="taskDueDate"
                                placeholder="Due date (Optional)"
                                parentHandler={handleInputChange}
                                parentObjectKey="dueDate"
                                required={false}
                            />
                        </div>
                    </div>

                    <div className="pb-6">
                        <button className="primary-btn text-xs font-light">
                            Create task
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}