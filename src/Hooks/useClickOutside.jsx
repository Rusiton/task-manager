import { useEffect, useRef } from "react";

export default function useClickOutside(callback, focused = true) {
    const ref = useRef();

    useEffect(() => {
        if (!focused) {
            return
        }

        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback()
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [callback, focused]);

    return ref;
}