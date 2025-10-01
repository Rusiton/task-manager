import { useEffect, useState } from "react"

export default function Switch({ 
    options, value, placeholder, parentHandler, parentObjectKey, disabled = false
}) {
    const [inputValue, setInputValue] = useState(value)
    
    const firstOption = {
        value: options.choices[0],
        background: options.backgrounds ? options.backgrounds[0] : 'var(--secondary)',
        textColor: options.textColors ? options.textColors[0] : 'var(--octonary)',
        icon: options.icons ? options.icons[0] : null,
    }

    const secondOption = {
        value: options.choices[1],
        background: options.backgrounds ? options.backgrounds[1] : 'var(--secondary)',
        textColor: options.textColors ? options.textColors[1] : 'var(--octonary)',
        icon: options.icons ? options.icons[1] : null,
    }

    useEffect(() => {
        setInputValue(value)
    }, [value, inputValue])

    const handleChange = (e) => {
        if (disabled || e.target.value.toLowerCase() === value) return

        setInputValue(e.target.value.toLowerCase())
        parentHandler(e.target.value.toLowerCase(), parentObjectKey)
    }

    return (
        <div>
            <p className="block mb-1 text-xs text-[var(--octonary)] font-normal select-none">{ placeholder }</p>

            <div className="w-64 flex border border-[var(--tertiary)] rounded-md overflow-hidden">
                <div className="relative w-1/2 h-10 flex">
                    <button 
                        id={`option-${firstOption.value.toLowerCase()}`}
                        type="button"
                        className={
                            "grow h-full cursor-pointer text-sm font-light" +
                            (inputValue !== firstOption.value.toLowerCase() ? "bg-transparent text-[var(--octonary)] hover:bg-[var(--secondary)]" : "")
                        }
                        style={{
                            backgroundColor: inputValue === firstOption.value.toLowerCase() && firstOption.background 
                                ? firstOption.background 
                                : undefined,
                            color: inputValue === firstOption.value.toLowerCase() && firstOption.textColor 
                                ? firstOption.textColor 
                                : undefined
                        }}
                        value={firstOption.value}
                        onClick={handleChange}
                        disabled={disabled}>
                            { firstOption.value }
                    </button>
                    { firstOption.icon && 
                        <label 
                            htmlFor={`option-${firstOption.value.toLowerCase()}`}
                            className="absolute left-0 m-0 h-full pl-4 flex items-center cursor-pointer">
                            { firstOption.icon }
                        </label>
                    }
                </div>

                <div className="relative w-1/2 h-10 flex">
                    <button
                        id={`option-${secondOption.value.toLowerCase()}`}
                        type="button"
                        className={
                            "grow h-full cursor-pointer text-sm font-light" +
                            (inputValue !== secondOption.value.toLowerCase() ? "bg-[var(--primary)] text-[var(--octonary)] hover:bg-[var(--secondary)]" : "")
                        }
                        style={{
                            backgroundColor: inputValue === secondOption.value.toLowerCase() && secondOption.background 
                                ? secondOption.background 
                                : undefined,
                            color: inputValue === secondOption.value.toLowerCase() && secondOption.textColor 
                                ? secondOption.textColor 
                                : undefined
                        }}
                        value={secondOption.value}
                        onClick={handleChange}
                        disabled={disabled}>
                            { secondOption.value }
                    </button>
                    { secondOption.icon && 
                        <label 
                            htmlFor={`option-${secondOption.value.toLowerCase()}`}
                            className="absolute left-0 m-0 h-full pl-4 flex items-center cursor-pointer">
                            { secondOption.icon }
                        </label>
                    }
                </div>

            </div>
        </div>
    )
}