import { generateRandomColor, generateRandomString } from "../../../Utils/String";

export default function Boards({ boardList }) {
    return boardList.map(board => 
        <div key={generateRandomString} className="board-card">
            <div className='w-full h-16' style={{ backgroundColor: generateRandomColor() }}></div>

            <div className="p-2">
                <h4 className="text-[var(--octonary)]">{board.name}</h4>
                <p className="text-xs font-light italic text-[var(--sestinary)]">
                    {board.description.length <= 32 
                        ? board.description
                        : board.description.slice(0, 32) + '...'
                    }
                </p>
            </div>
        </div>
    )
}