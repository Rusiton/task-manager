import { useEffect, useRef } from "react";

export default function useKey(keyList, callback) {
    const ref = useRef()

    useEffect(() => {
        function handleKeyPress(event) {
            if (keyList.includes(event.key)) {
                callback()
            }
        }

        document.addEventListener('keydown', handleKeyPress)

        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [keyList, callback])

    return ref
}