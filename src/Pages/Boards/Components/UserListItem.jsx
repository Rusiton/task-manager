export default function UserListItem({ user, optionButtons }) {
    return (
        <li className="px-3 py-2 w-full shadow-md bg-[var(--secondary)] rounded-xl flex items-center justify-between">
            <span className="text-[13px] text-[var(--octonary)]">{ user.email }</span>

            <div className="flex gap-2">
                {optionButtons.map(button =>
                    <button 
                        className={
                            "px-4 py-2 text-sm rounded-full cursor-pointer transition-colors hover:bg-[var(--blue)] "
                            + button.styles}
                        key={button.text} 
                        onClick={() => button.callback(user.token)}>
                            {button.text}
                    </button>
                )}
            </div>
        </li>
    )
}