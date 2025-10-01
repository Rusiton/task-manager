export default function NavigationButton({ setSection, isSelected, text }) {
    return (
        <button 
            className={isSelected ? 'selected' : ''}
            onClick={() => setSection(text)}>
            {text}
        </button>
    )
}