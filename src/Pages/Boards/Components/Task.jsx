export default function Task({ task }) {
    return (
        <div>
            <button 
                className="shadow-md w-full px-3 py-2 rounded-md bg-[var(--secondary)] flex flex-wrap cursor-pointer outline-[var(--blue)] hover:outline-2">
                <p className="overflow-hidden w-full text-left text-xs text-[var(--octonary)]">{ task.name }</p>
                <div className="mt-1 w-full">
                    <div className="float-right w-6 h-6 rounded-full bg-[var(--octonary)]">
                        {/* ASSIGNED TO USER PROFILE HERE */}
                    </div>
                </div>
            </button>
        </div>
    )
}