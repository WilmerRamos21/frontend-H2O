import { useEffect, useRef } from "react";

// Este hook recibe un elemento (ref) y una función a ejecutar (callback)
export const useOutsideClick = (ref, callback) => {
    useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el elemento existe y el clic NO fue dentro del elemento
        if (ref.current && !ref.current.contains(event.target)) {
        callback();
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, [ref, callback]);
};