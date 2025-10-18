import { useState } from "react";
import { noteColors } from "../../utils/constants";
import Toggler from "../common/Toggler";
import Tooltip from "../common/Tooltip";
import { Palette } from "lucide-react";

interface ColorMenuProps {
  currentColor?: string;
  onSelect?: (color: string) => void;
  isLoading?: boolean;
}

export default function ColorMenu({
  currentColor = "#ffffff",
  onSelect,
  isLoading = false,
}: ColorMenuProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);

  const handleChooseColor = (color: string, closeMenu?: () => void) => {
    setSelectedColor(color);
    onSelect?.(color);
    closeMenu?.();
  };

  return (
    <Toggler>
      {/* Toggle button */}
      <Toggler.Toggle isLoading={isLoading}>
        {({ isOpen }) => (
          <div className="relative group">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition duration-300
                ${
                  isOpen
                    ? " bg-blue-600 text-white"
                    : " text-slate-500 bg-slate-200"
                }`}
            >
              <Palette size={24} />
            </div>
            {!isOpen && !isLoading && (
              <Tooltip content="Choose Color" position="top" />
            )}
          </div>
        )}
      </Toggler.Toggle>

      {/* Dropdown menu */}
      <Toggler.Menu>
        {({ closeMenu }) => (
          <div
            className="flex flex-wrap gap-2 w-55 h-full max-h-96 overflow-y-auto overflow-x-hidden mb-2 bg-white p-4 rounded-lg shadow-md border border-slate-200 
          [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-400
    dark:[&::-webkit-scrollbar-track]:bg-neutral-400
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700
          "
          >
            {noteColors.map((color) => (
              <button
                key={color}
                onClick={() => handleChooseColor(color, closeMenu)}
                className={`w-10 h-10 rounded-full border transition-transform hover:scale-110 cursor-pointer`}
                style={{
                  backgroundColor: color,
                  borderColor: selectedColor === color ? "#005fff" : "#ccc",
                }}
              />
            ))}
          </div>
        )}
      </Toggler.Menu>
    </Toggler>
  );
}
