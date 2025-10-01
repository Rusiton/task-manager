import { useContext, useState } from "react"
import { AppContext } from "../../Context/AppContext"

import api from "../../../Utils/ApiClient"

import Input from "../../Components/Input"
import Textarea from "../../Components/Textarea"

export default function ProfileSettings({ setMessage }) {
    const { user, setUser, accessToken } = useContext(AppContext)
    
    const [formData, setFormData] = useState({
        'name': user.profile.name ? user.profile.name : '',
        'description': user.profile.description ? user.profile.description : '',
    })

    const [submittingData, setSubmittingData] = useState(false)
    const [errors, setErrors] = useState(null)

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

    const handleSubmit = async event => {
        event.preventDefault()

        if (submittingData) return

        let hasDataChanged = false

        Object.keys(formData).forEach(key => {
            if (formData[key] !== user[key]) hasDataChanged = true
        })

        if (!hasDataChanged) return

        setSubmittingData(true)
        setMessage(null)
        setErrors(null)

        validateValues({
            name: {value: formData.name, maxLength: 40, ignoreValue: false},
            description: {value: formData.description, maxLength: 400, ignoreValue: true},
        })

        const result = await api.patch('/auth/users/profile', 
            formData, 
            {headers: { Authorization: `Bearer ${accessToken}` }
        })

        if (result.success) {
            setUser({ ...user, profile: {  ...user.profile, name: result.data.profile.name, description: result.data.profile.description} })
            setMessage('Data saved successfully')
        }
        else {
            setFormData({
                'name': user.profile.name ? user.profile.name : '',
                'description': user.profile.description ? user.profile.description : '',
            })

            setErrors(result.error.errors)
        }

        setSubmittingData(false)
    }

    return (
        <form 
            onSubmit={(e) => handleSubmit(e)} 
            className="w-full grow lg:w-10/12 p-4 space-y-8 flex flex-col">

            <h1 className="title text-[var(--octonary)]">Profile</h1>

            <div className="grow pb-8 flex flex-col justify-between gap-8">
                <div className="space-y-8">
                    <div>
                        <Input
                            value={formData.name}
                            name={'profile-name'} 
                            placeholder={'Profile name'}
                            maxLength={40}
                            parentHandler={handleInputChange}
                            parentObjectKey={'name'}
                            required={true}
                            error={errors?.name ? errors.name : false}
                        />
                    </div>

                    <div className="h-56 flex flex-col">
                        <Textarea
                            value={formData.description}
                            type="text"
                            name={'profile-description'} 
                            placeholder={'Biography'}
                            maxLength={400}
                            parentHandler={handleInputChange}
                            parentObjectKey={'description'}
                            required={false}
                            error={errors?.description ? errors.description : false}
                        />
                    </div>
                </div>

                <div>
                    <button 
                        className={"primary-btn" + (submittingData ? ' disabled-btn' : '')}
                        disabled={submittingData}>
                        Save
                    </button>
                </div>
            </div>
        </form>
    )
}