import { generateRandomString } from "../../../Utils/String"
import NavigationButton from "./NavigationButton"

export default function SideNavigationMenu({ cssClass, section, setSection, navList }) {
    return (
        <div className="section-card min-w-48">
            <ul className={cssClass}>
                {navList.map(option => 
                <li key={generateRandomString()} className="option-item">
                    <NavigationButton 
                        setSection={setSection} 
                        isSelected={section === option.value} 
                        text={option.value} 
                        icon={option.icon ? option.icon : null}
                    />
                </li>)}
            </ul>
        </div>
    )
}