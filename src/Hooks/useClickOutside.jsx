import { useEffect, useRef } from "react";

export default function useClickOutside(focused = true, callback) {
    const ref = useRef();
    const callbackRef = useRef(callback);

    // Keep the callback ref updated
    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => {
        if (!focused) {
            return
        }

        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callbackRef.current()
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [focused]); // Empty dependency array - only runs once

    return ref;
}