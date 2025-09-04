import React, { useEffect, useRef, useState } from "react"

interface Props {
    trigger : React.ReactNode;
    children : React.ReactNode;
    otherStyles? : string;
    isOpen? : boolean;
    onOpenChange? : (isOpen: boolean) => void;
}

export const DropDown = ({ 
    trigger, 
    children, 
    otherStyles='w-40 -translate-x-24',
    isOpen: externalIsOpen,
    onOpenChange
} : Props) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Use external state if provided, otherwise use internal state
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const setIsOpen = (newIsOpen: boolean) => {
        if (onOpenChange) {
            onOpenChange(newIsOpen);
        } else {
            setInternalIsOpen(newIsOpen);
        }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          event.target instanceof Node && 
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
    
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button className="w-full" onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </button>
            {isOpen && <div className={`absolute z-10 bg-white rounded-md border-2 border-gray-200 overflow-hidden ${otherStyles}`}>
                {children}
            </div>}
        </div>
    )
}