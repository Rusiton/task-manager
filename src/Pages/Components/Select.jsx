import { useEffect, useState } from "react"
import { generateRandomString } from "../../Utils/String"

export default function Select({ value = '', name, placeholder, optionList, parentHandler, parentObjectKey, required}) {
    const [selectValue, setSelectValue] = useState(value)

    useEffect(() => {
        setSelectValue(value)
    }, [value])

    const handleChange = (e) => {
        setSelectValue(e.target.value)
        parentHandler(e.target.value, parentObjectKey)
    }

    return <>
        <label htmlFor={name} className="text-[var(--octonary)]">{ placeholder }</label>
        <select 
            required={required}
            name={name} 
            id={name}
            value={selectValue}
            onChange={handleChange}>

                <option value="">
                    None
                </option>

                {optionList.map(option => 
                    <option key={generateRandomString()} value={option.token}>
                        { option.name }
                    </option>
                )}

        </select>
    </>
}