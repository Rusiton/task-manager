import { generateRandomString } from "../../../Utils/String"
import NavButton from "./ProfileNavButton"

export default function ProfileNav({ profileNavigation  , setProfileNavigation, navList }) {
    return (
        <ul className="option-list">
            {navList.map(option => 
            <li key={generateRandomString()} className="option-item">
                <NavButton 
                    setProfileNavigation={setProfileNavigation} 
                    isSelected={profileNavigation === option} 
                    text={option} 
                />
            </li>)}
        </ul>
    )
}