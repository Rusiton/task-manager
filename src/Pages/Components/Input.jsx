import { useEffect, useState } from "react";

export default function Input({ value = '', name, placeholder, maxLength, parentHandler, parentObjectKey, required, disabled = false, error = false }) {
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
        <input 
            type="text"
            required={required}
            id={name}
            name={name} 
            className="text-input"
            maxLength={maxLength}
            value={inputValue}
            onChange={handleChange}
            disabled={disabled}
        />
        
        { !disabled &&
            <div className="w-full">
                {error && 
                    <span className="error">
                        { error }
                    </span>
                }
                <span 
                    className={"mt-2 text-[var(--octonary)] text-xs float-right" + (inputValue.length == maxLength ? ' text-[var(--red)]' : '')}>
                    { inputValue.length } / { maxLength }
                </span>
            </div>
        }
    </>
}