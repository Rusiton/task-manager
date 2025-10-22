import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Searchbar({ placeholder, searchValue, setSearchValue }) {
    return (
        <div className="relative w-full h-full flex items-center">
            <div className="px-2 absolute left-0 flex items-center">
                <FontAwesomeIcon 
                    icon={faMagnifyingGlass} 
                    size="lg" 
                    className="text-[var(--blue)]" 
                />
            </div>

            <input 
                className="rounded-full pl-10"
                type="text"
                name="search"
                value={searchValue}
                placeholder={placeholder}
                autoComplete="off"
                onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
    )
}