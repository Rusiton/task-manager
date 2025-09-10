import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { generateRandomString } from "../../../Utils/String";
import { faUsers, faUserShield } from "@fortawesome/free-solid-svg-icons";
import EmptyProfileSection from "./EmptyProfileSection";

export default function Boards({ boardList }) {
    
    if (boardList.length === 0) return <EmptyProfileSection />

    return boardList.map(board => 
        <div key={generateRandomString()} className="board-card">
            <div className="flex-1">
                <h4 className="text-[var(--octonary)]">
                    { board.name }
                </h4>
                <p className="text-xs text-[var(--quinary)] italic">{ board.description }</p>
            </div>
            <div className="flex items-center">
                <ul className="list-none flex">
                    <li>
                        <FontAwesomeIcon icon={faUsers} size="sm" className="text-[var(--octonary)]" />
                        <span className="ml-1 text-sm text-[var(--septenary)]">{ board.members.length }</span>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faUserShield} size="sm" className="text-[var(--octonary)]" />
                        <span>{ board.admins.length }</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}