import { generateRandomString } from "../../Utils/String"

export default function LoadingBoards({ boardStyle }) {
    const loadingList = new Array(5).fill(null)

    return boardStyle === 'row'
        ? loadingList.map(() => 
            <div key={generateRandomString()} className="board-row-loading">
                <div className="flex-1 h-full flex flex-wrap items-center">
                    <div className="w-2/4 h-6 bg-[var(--secondary)]"></div>
                    <div className="w-3/4 h-4 bg-[var(--secondary)]"></div>
                </div>
                <div className="w-14 h-full bg-[var(--secondary)]" />
            </div>
        ) : loadingList.map(() => 
            <div key={generateRandomString()} className="board-card-loading" />
        )
}