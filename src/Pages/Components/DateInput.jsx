import { useEffect, useState } from "react"

export default function DateInput({ value = '', name, placeholder, parentHandler, parentObjectKey, required, disabled = false}) {
    const [dateValue, setDateValue] = useState(value)

    useEffect(() => {
        setDateValue(value)
    }, [value])

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
            disabled={disabled}
        />
    </>
}