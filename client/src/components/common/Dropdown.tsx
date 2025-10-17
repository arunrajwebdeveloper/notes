import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

// 1. Define the props interface for type safety
interface DropdownProps {
  headerText: string;
  children: ReactNode; // 'ReactNode' covers all valid React children (JSX, string, number, array)
  buttonClasses?: string; // Optional prop for custom button Tailwind classes
  contentClasses?: string; // Optional prop for custom content container Tailwind classes
}

const Dropdown: React.FC<DropdownProps> = ({
  headerText,
  children,
  // Provide default values here for optional props
  buttonClasses = "bg-gray-200 hover:bg-gray-300 text-gray-800",
  contentClasses = "border border-gray-300 bg-white",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // 2. Use useRef with the correct HTML element type (HTMLDivElement)
  const sectionRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // 3. Effect hook for handling clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the ref exists and if the clicked target (event.target)
      // is not contained within the component's DOM element.
      if (
        sectionRef.current &&
        !sectionRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    // 4. Attach the ref to the top-level container element
    <div ref={sectionRef} className="w-full max-w-md mx-auto my-4 relative">
      {/* Toggle Button */}
      <button
        onClick={toggleOpen}
        className={`flex justify-between items-center w-full p-3 font-semibold rounded-lg transition duration-200 ease-in-out ${buttonClasses}`}
      >
        <span>{headerText}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Content Section (Dropdown) */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out absolute z-10 w-full ${
          isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className={`p-4 rounded-lg shadow-xl ${contentClasses}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
