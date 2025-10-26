import { useEffect, useState } from "react";
import MemberRow from "./MemberRow";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MembersPanel({ isUserOwner, isUserAdmin, board, setBoard, setModal }) {
    const memberList = [board.owner, ...board.members]

    return (
        <div className="relative shadow-md overflow-hidden w-3/4 max-w-[700px] h-96 rounded-md bg-[var(--primary)] flex flex-col">

            <div className="shadow-md w-full p-3 flex items-center justify-between">
                <p className="text-[var(--octonary)] font-light select-none">
                    Member List
                </p>
                <button 
                    className="w-10 p-1 rounded-md cursor-pointer transition-colors hover:bg-[var(--secondary)]"
                    onClick={() => setModal(null)}>
                    <FontAwesomeIcon icon={faXmark} className="text-[var(--octonary)]" />
                </button>
            </div>

            <div className="w-full min-h-0 grow p-3 flex flex-col">

                <div className="w-full min-h-0 grow border-[var(--quaternary)] flex flex-col gap-2">
                    { memberList.map(member => 
                        <MemberRow 
                            key={member.token} 
                            board={board}
                            setBoard={setBoard}
                            member={member} 
                            isUserOwner={isUserOwner}
                            isUserAdmin={isUserAdmin}
                            setModal={setModal}
                        />
                    ) }
                </div>

            </div>
        </div>
    )
}