export default function NavigationButton({ setSection, isSelected, text, icon }) {
    return (
        <button className={"flex items-center gap-2" + (isSelected ? ' selected' : '')} onClick={() => setSection(text)}>
            <span>{ icon }</span>
            <span>{text}</span>
        </button>
    )
}