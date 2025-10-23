export default function InvtitationItem({ invitation }) {
    console.log(invitation)
    return (
        <li className="shadow-md p-4 bg-[var(--secondary)]">
            <p className="text-[var(--sestinary)]">Invited to {invitation.board.name}</p>
        </li>
    )
}