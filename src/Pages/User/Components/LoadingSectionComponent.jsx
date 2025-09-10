import { generateRandomString } from "../../../Utils/String"

export default function LoadingSectionComponent({ type }) {
    let defaultLoadingClass

    if (type === 'board') defaultLoadingClass = 'board-loading'
    
    const loadingList = new Array(6).fill(defaultLoadingClass)



    return loadingList.map(loadingClass => 
        <div key={generateRandomString()} className={loadingClass}>
            <div className="flex-1 h-full flex flex-wrap items-center">
                <div className="w-2/4 h-6 bg-[var(--secondary)]"></div>
                <div className="w-3/4 h-4 bg-[var(--secondary)]"></div>
            </div>
            <div className="w-14 h-full bg-[var(--secondary)]">

            </div>
        </div>
    )
}