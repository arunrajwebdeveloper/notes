import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import type { ReactNode, RefObject } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Icons for the toggle switch

// ====================================================================
// CONTEXT SETUP
// ====================================================================

interface TogglerContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sectionRef: RefObject<HTMLDivElement | null>;
  toggleOpen: () => void; // Helper function added for easy access
}

// Create the Context
const TogglerContext = createContext<TogglerContextType | undefined>(undefined);

// Custom hook to use the context
const useTogglerContext = () => {
  const context = useContext(TogglerContext);
  if (context === undefined) {
    throw new Error(
      "Toggler compound components must be rendered within a <Toggler>",
    );
  }
  return context;
};

// ====================================================================
// CHILD COMPONENTS (Toggler.Toggle and Toggler.Menu)
// ====================================================================

interface ToggleProps {
  children: ReactNode;
  className?: string;
}

// Toggler.Toggle: The switch/button content
const Toggle: React.FC<ToggleProps> = ({
  children,
  className = "bg-gray-200 hover:bg-gray-300 text-gray-800",
}) => {
  const { isOpen, toggleOpen } = useTogglerContext();

  // You can automatically include the icon if no custom children are provided
  const defaultToggleContent = (
    <>
      <span>{children}</span>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </>
  );

  return (
    <button
      onClick={toggleOpen}
      className={`flex justify-between items-center w-full p-3 font-semibold rounded-lg transition duration-200 ease-in-out ${className}`}
    >
      {/* If children is just a string, we use the default content including the icon. 
          For full control, users can pass the icon in children. */}
      {typeof children === "string" ? defaultToggleContent : children}
    </button>
  );
};

interface MenuProps {
  children: ReactNode;
  className?: string; // Tailwind classes for the menu appearance
}

// Toggler.Menu: The collapsible content section
const Menu: React.FC<MenuProps> = ({
  children,
  className = "border border-gray-300 bg-white",
}) => {
  const { isOpen } = useTogglerContext();

  return (
    // Dynamic Tailwind classes for the dropdown animation
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out absolute z-10 w-full ${
        isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
      }`}
    >
      <div className={`p-4 rounded-lg shadow-xl ${className}`}>{children}</div>
    </div>
  );
};

// ====================================================================
// MAIN COMPONENT (Toggler)
// ====================================================================

interface TogglerProps {
  children: ReactNode;
  className?: string;
}

// Combine the main component with its subcomponents for the Compound Pattern
const Toggler: React.FC<TogglerProps> & {
  Toggle: typeof Toggle;
  Menu: typeof Menu;
} = ({ children, className = "w-full max-w-md mx-auto my-4 relative" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Helper function to toggle state
  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Outside-click logic using useEffect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // event.target needs assertion to Node for contains() to work with strict TS
      if (
        sectionRef.current &&
        !sectionRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this runs once on mount

  const contextValue = { isOpen, setIsOpen, sectionRef, toggleOpen };

  return (
    <div ref={sectionRef} className={className}>
      <TogglerContext.Provider value={contextValue}>
        {children}
      </TogglerContext.Provider>
    </div>
  );
};

// Attach the subcomponents to the main Toggler namespace
Toggler.Toggle = Toggle;
Toggler.Menu = Menu;

export default Toggler;

// ====================================================================
// EXPORT TYPES
// ====================================================================

export type { TogglerProps, ToggleProps, MenuProps };
