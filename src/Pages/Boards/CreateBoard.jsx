import { useContext, useState } from "react"
import { AppContext } from "../Context/AppContext"

import Input from "../Components/Input"
import Textarea from "../Components/Textarea"
import api from "../../Utils/ApiClient"
import { useNavigate } from "react-router-dom"

export default function CreateBoard() {
    const { accessToken } = useContext(AppContext)
    
    const [creatingBoard, setCreatingBoard] = useState(false)
    const [creatingBoardInstances, setCreatingBoardInstances] = useState(0)

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    })

    const navigate = useNavigate()


    const handleInputChange = (value, key) => {
        setFormData({ ...formData, [key]: value })
    }


    const validateValues = (valuesObject) => {
        Object.keys(valuesObject).map(key => {
            const { value, maxLength, ignoreValue } = valuesObject[key]
            
            if (!ignoreValue && (!value || value === '')) throw new Error(`${key}: Empty value.`)
            if (value.length > maxLength) throw new Error(`${key}: Exceeded max character limit.`)
        })
    }


    async function handleSubmit(e) {
        e.preventDefault()

        if (creatingBoardInstances > 0) return

        setCreatingBoardInstances(1)
        setCreatingBoard(true)

        validateValues({
            name: {value: formData.name, maxLength: 80, ignoreValue: false},
            description: {value: formData.description, maxLength: 400, ignoreValue: true},
        })

        const result = await api.post('/boards', formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            navigate(`/boards/${result.data.token}`)
        }

        setCreatingBoardInstances(0)
        setCreatingBoard(false)
    }


    return (
        <div className="page-container">
            <div className="w-full h-full shadow-md bg-[var(--primary)] flex justify-center">
                <form 
                    onSubmit={(e) => handleSubmit(e)} 
                    className="w-full sm:w-3/4 md:w-7/12 p-4 space-y-8">

                    <h1 className="title text-[var(--octonary)]">Create a new Board</h1>

                    <div>
                        <Input 
                            name={'board-name'} 
                            placeholder={'Board Name'}
                            maxLength={80}
                            parentHandler={handleInputChange}
                            parentObjectKey={'name'}
                            required={true}
                        />
                    </div>
                    <div className="h-56 flex flex-col">
                        <Textarea 
                            name={'board-description'}
                            placeholder={'Board Description'}
                            maxLength={400}
                            parentHandler={handleInputChange}
                            parentObjectKey={'description'}
                            requried={false}
                        />
                    </div>

                    <button 
                        className={"primary-btn" + (creatingBoard ? ' disabled-btn' : '')}
                        disabled={creatingBoard}>
                        Create Board
                    </button>
                </form>
            </div>
        </div>
    )
}