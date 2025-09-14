export default function Modal({ modal }) {
    return (
        <div className={"modal-container" + (!modal ? ' not-visible' : '')}>
            <div>
                { modal }
            </div>
        </div>
    )
}