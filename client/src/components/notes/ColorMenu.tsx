import { useEffect, useState } from "react";
import { noteColors } from "../../utils/constants";
import Toggler from "../common/Toggler";
import Tooltip from "../common/Tooltip";
import { CircleCheck, Palette } from "lucide-react";
import { HexColorPicker } from "react-colorful";

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
  const [selectedColor, setSelectedColor] = useState<string>(currentColor);
  const [isModalOpend, setIsModalOpended] = useState<boolean>(false);

  useEffect(() => {
    if (isModalOpend) {
      setSelectedColor(currentColor);
    } else {
      setSelectedColor("#ffffff");
    }
  }, [isModalOpend]);

  const handleChooseColor = (color: string) => {
    setSelectedColor(color);
    onSelect?.(color);
  };

  return (
    <Toggler>
      {/* Toggle button */}
      <Toggler.Toggle isLoading={isLoading}>
        {({ isOpen }) => {
          // Set menu open state
          setIsModalOpended(isOpen as boolean);

          return (
            <div className="relative group">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition duration-300
                ${isOpen ? " bg-blue-600 text-white" : "text-slate-900"}`}
              >
                <Palette size={20} />
              </div>
              {!isOpen && !isLoading && (
                <Tooltip content="Choose Color" position="top" />
              )}
            </div>
          );
        }}
      </Toggler.Toggle>

      {/* Dropdown menu */}
      <Toggler.Menu>
        {() => (
          <div
            className="w-68 h-full max-h-96 overflow-y-auto overflow-x-hidden mb-2 bg-white p-4 rounded-lg shadow-md border border-slate-200 
          [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-400
    dark:[&::-webkit-scrollbar-track]:bg-neutral-400
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700
          "
          >
            {/* COLOR PICKER */}
            <HexColorPicker
              color={selectedColor}
              onChange={handleChooseColor}
              style={{ width: "100%" }}
            />

            <div className="flex flex-wrap gap-2 mt-4">
              {noteColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleChooseColor(color)}
                  className={`w-10 h-10 flex border border-slate-200 rounded-full transition-transform hover:scale-110 cursor-pointer`}
                  style={{
                    backgroundColor: color,
                  }}
                >
                  {selectedColor === color && (
                    <CircleCheck
                      size={26}
                      fill="white"
                      stroke={color}
                      className=" m-auto"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </Toggler.Menu>
    </Toggler>
  );
}
