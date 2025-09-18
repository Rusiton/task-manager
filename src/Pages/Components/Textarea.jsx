import { useEffect, useState } from "react";

export default function Textarea({ value = '', name, placeholder, maxLength, parentHandler, parentObjectKey, requried, disabled = false }) {
    const [inputValue, setInputValue] = useState(value)

    useEffect(() => {
        setInputValue(value)
    }, [value])

    const handleChange = (e) => {
        if (e.target.value.length <= maxLength) {
            setInputValue(e.target.value)
            parentHandler(e.target.value, parentObjectKey)
        }
    }

    return <>
        <label htmlFor={name} className="text-[var(--octonary)]">{ placeholder }</label>
        <textarea 
            required={requried}
            id={name}
            name={name}
            maxLength={maxLength}
            value={inputValue}
            onChange={handleChange}
            disabled={disabled}
        />
        { !disabled && 
            <div className="w-full">
                <span 
                    className={"mt-2 text-[var(--octonary)] text-xs float-right" + (inputValue.length == maxLength ? ' text-[var(--red)]' : '')}>
                    { inputValue.length } / { maxLength }
                </span>
            </div>
        }
        
    </>
}