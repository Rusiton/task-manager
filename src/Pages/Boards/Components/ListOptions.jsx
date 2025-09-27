import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useClickOutside from "../../../Hooks/useClickOutside";

export default function ListOptions({ visiblity, setVisibility, list, removeList }) {
    const optionsRef = useClickOutside(() => {
        if (visiblity) {
            setVisibility(false)
        }
    })


    return (
        <div ref={optionsRef} className={ (!visiblity ? 'hidden ' : '') + "absolute z-10 left-full w-full border-[1px] border-[var(--tertiary)] rounded-xs bg-[var(--primary)] overflow-hidden"}>
        
            <button 
                className="w-full p-2 flex items-center cursor-pointer transition-colors hover:bg-[var(--tertiary)]"
                onClick={() => removeList(list.token)}>
                <FontAwesomeIcon icon={faTrash} className="text-[var(--red)]" />
                <span className="grow text-sm text-[var(--octonary)] font-light">Delete list</span>
            </button>

        </div>
    )
}