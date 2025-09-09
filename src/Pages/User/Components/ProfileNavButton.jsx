export default function ProfileNavButton({ setProfileNavigation, isSelected, text }) {
    return (
        <button 
            className={isSelected ? 'selected' : ''}
            onClick={() => setProfileNavigation(text)}>
            {text}
        </button>
    )
}