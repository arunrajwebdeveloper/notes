import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import type { ReactNode, RefObject } from "react";

// ====================================================================
// 1. CONTEXT SETUP
// ====================================================================

// Define the shape of the context state
interface TogglerContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sectionRef: RefObject<HTMLDivElement | null>;
  toggleOpen: () => void; // Helper function added for easy access
}

interface MenuRenderProp {
  closeMenu?: () => void;
  isOpen?: boolean;
}

interface ComponentProps {
  // Change children to accept ReactNode OR a function that returns ReactNode
  children: ReactNode | ((utilities: MenuRenderProp) => ReactNode);
  className?: string; // Tailwind classes for the button appearance
}

interface TogglerProps {
  children: ReactNode;
  className?: string; // Tailwind classes for the wrapper div
}

interface ToggleProps extends ComponentProps {}
interface MenuProps extends ComponentProps {}

// Create the Context
const TogglerContext = createContext<TogglerContextType | undefined>(undefined);

// Custom hook to use the context
const useTogglerContext = () => {
  const context = useContext(TogglerContext);
  if (context === undefined) {
    throw new Error(
      "Toggler compound components must be rendered within a <Toggler>"
    );
  }
  return context;
};

// ====================================================================
// 2. CHILD COMPONENTS (Toggler.Toggle and Toggler.Menu)
// ====================================================================

// Toggler.Toggle: The switch/button content
const Toggle: React.FC<ToggleProps> = ({ children, className = "" }) => {
  const { isOpen, toggleOpen, setIsOpen } = useTogglerContext();

  // Utility function to close the menu
  const closeMenu = () => setIsOpen(false);

  // Determine content to render: use the render prop function if children is a function, otherwise use children directly.
  const content =
    typeof children === "function"
      ? (children as (utilities: MenuRenderProp) => ReactNode)({
          closeMenu,
          isOpen,
        })
      : children;

  return (
    <button
      onClick={toggleOpen}
      className={`transition relative duration-300 ease-in-out ${className}`}
    >
      {content}
    </button>
  );
};

// Toggler.Menu: The collapsible content section
const Menu: React.FC<MenuProps> = ({ children, className = "" }) => {
  const { isOpen, setIsOpen } = useTogglerContext();

  // Utility function to close the menu
  const closeMenu = () => setIsOpen(false);

  // Determine content to render: use the render prop function if children is a function, otherwise use children directly.
  const content =
    typeof children === "function"
      ? (children as (utilities: MenuRenderProp) => ReactNode)({
          closeMenu,
          isOpen,
        })
      : children;

  return (
    // Dynamic Tailwind classes for the dropdown animation
    isOpen && (
      <div
        className={`transition-all duration-300 ease-in-out absolute bottom-full left-0 mt-2 z-10 ${className}`}
      >
        {content}
      </div>
    )
  );
};

// ====================================================================
// 3. MAIN COMPONENT (Toggler)
// ====================================================================

// Combine the main component with its subcomponents for the Compound Pattern
const Toggler: React.FC<TogglerProps> & {
  Toggle: typeof Toggle;
  Menu: typeof Menu;
} = ({ children, className = "relative" }) => {
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

export type { TogglerProps, ToggleProps, MenuProps };
