import { useContext, useState } from "react"
import { AppContext } from "../../Context/AppContext"

import api from "../../../Utils/ApiClient"

import Input from "../../Components/Input"

export default function AccountSettings({ setMessage }) {
    const { user, setUser, accessToken } = useContext(AppContext)

    const [formData, setFormData] = useState({
        'name': user.name,
        'email': user.email,
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
            name: {value: formData.name, maxLength: 80, ignoreValue: false},
            email: {value: formData.email, maxLength: 80, ignoreValue: false},
        })

        const result = await api.patch('/auth/users', formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            setUser({ ...user, name: result.data.name, email: result.data.email })
            setMessage('Data saved successfully')
        }
        else {
            setFormData({
                'name': user.name,
                'email': user.email,
            })

            setErrors(result.error.errors)
        }

        setSubmittingData(false)
    }

    return (
        <form 
            onSubmit={(e) => handleSubmit(e)} 
            className="w-full grow lg:w-10/12 p-4 space-y-8 flex flex-col">

            <h1 className="title text-[var(--octonary)]">Account</h1>

            <div className="grow pb-8 flex flex-col justify-between gap-8">
                <div className="space-y-8">
                    <div>
                        <Input
                            value={formData.name}
                            name={'user-name'} 
                            placeholder={'Username'}
                            maxLength={80}
                            parentHandler={handleInputChange}
                            parentObjectKey={'name'}
                            required={true}
                            error={errors?.name ? errors.name : false}
                        />
                    </div>

                    <div>
                        <Input
                            value={formData.email}
                            name={'user-email'} 
                            placeholder={'Email'}
                            maxLength={80}
                            parentHandler={handleInputChange}
                            parentObjectKey={'email'}
                            required={true}
                            error={errors?.email ? errors.email : false}
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