import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { generateRandomString } from "../../Utils/String";
import { faUsers, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function UserBoards({ boardList, style = 'row' }) {

    return style === 'row'
        ? boardList.map(board => 
            <Link to={`/boards/${board.token}`} key={generateRandomString()} className="board-row">
                <div className="flex-1">
                    <h4 className="text-[var(--octonary)]">
                        { board.name }
                    </h4>
                    <p className="text-xs text-[var(--quinary)] italic">{ board.description }</p>
                </div>
                <div className="flex items-center">
                    <ul>
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
            </Link>
        ) : boardList.map(board => 
            <Link to={`/boards/${board.token}`} key={generateRandomString()}>
                <div className="board-card">
                    <div className="p-2">
                        <h4 className="my-2 text-center text-[var(--octonary)]">
                            { board.name }
                        </h4>
                        <ul>
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
            </Link>
        )
    
}