import { useState } from "react"

export default function DateInput({ name, placeholder, parentHandler, parentObjectKey, required}) {
    const [dateValue, setDateValue] = useState('')

    const handleChange = (e) => {
        setDateValue(e.target.value)
        parentHandler(e.target.value, parentObjectKey)
    }

    return <>
        <label htmlFor={name} className="text-[var(--octonary)]">{ placeholder }</label>
        <input 
            type="date" 
            className="date-input"
            required={required}
            name={name}
            id={name}
            value={dateValue}
            onChange={handleChange}
        />
    </>
}