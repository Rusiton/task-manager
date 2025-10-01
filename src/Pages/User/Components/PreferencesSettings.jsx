import { useContext, useState } from "react"
import { AppContext } from "../../Context/AppContext"

import api from "../../../Utils/ApiClient"
import Switch from "../../Components/Switch"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons"

export default function PreferencesSettings({ setMessage }) {
    const { user, setUser, accessToken } = useContext(AppContext)

    const [formData, setFormData] = useState({
        'theme': user.settings.theme,
    })

    const [submittingData, setSubmittingData] = useState(false)

    const switchOptions = {
        choices: ['Light', 'Dark'],
        backgrounds: ['var(--blue)', 'var(--darkgray)'],
        textColors: ['white', 'white'],
        icons: [
            <FontAwesomeIcon icon={faSun} size="xl" className="text-yellow-400" />, 
            <FontAwesomeIcon icon={faMoon} size="xl" className="text-[var(--octonary)]" />
        ],
    }

    const handleInputChange = (value, key) => {
        setFormData({ ...formData, [key]: value })
    }

    const validateValues = (valuesObject) => {
        Object.keys(valuesObject).map(key => {
            const { value, maxLength, between } = valuesObject[key]
            
            if (value && (!value || value === '')) throw new Error(`${key}: Empty value.`)

            if (maxLength && (value.length > maxLength)) throw new Error(`${key}: Exceeded max character limit.`)

            if (value && between && (!between.includes(value))) throw new Error(`${key}: Invalid value.`)
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()

        if (submittingData) return

        let hasDataChanged = false

        Object.keys(formData).forEach(key => {
            if (formData[key] !== user.settings[key]) hasDataChanged = true
        })

        if (!hasDataChanged) return

        setUser({ ...user, settings: { ...user.settings, theme: formData.theme }})

        setSubmittingData(true)
        setMessage(null)

        validateValues({
            theme: {value: formData.theme, between: ['light', 'dark']},
        })

        const result = await api.patch('/auth/users/settings', formData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (result.success) {
            setUser({ ...user, settings: { ...user.settings, theme: result.data.settings.theme } })
            setMessage('Data saved successfully')
        }
        else {
            setUser(user)

            setFormData({
                'theme': user.settings.theme,
            })
        }

        setSubmittingData(false)
    }

    return (
        <form 
            onSubmit={(e) => handleSubmit(e)} 
            className="w-full grow lg:w-10/12 p-4 space-y-8 flex flex-col">

            <h1 className="title text-[var(--octonary)]">Preferences</h1>

            <div className="grow pb-8 flex flex-col justify-between gap-8">
                <div className="space-y-8">
                    <div>
                        <Switch 
                            options={switchOptions}
                            value={formData.theme}
                            placeholder="Color theme"
                            parentHandler={handleInputChange}
                            parentObjectKey="theme"
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