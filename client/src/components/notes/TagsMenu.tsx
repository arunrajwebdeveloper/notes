import Toggler from "../common/Toggler";
import Tooltip from "../common/Tooltip";
import { CircleCheck, Tag } from "lucide-react";
import type { Tag as TagType } from "../../types/note.types";

interface TagsMenuProps {
  tags: TagType[];
  selectedTags: TagType[];
  onChange: (tags: TagType[]) => void;
  isLoading?: boolean;
}

function TagsMenu({
  tags = [],
  selectedTags = [],
  onChange,
  isLoading = false,
}: TagsMenuProps) {
  const onChooseTag = (tag: TagType) => {
    // Check if tag is already selected
    const isAlreadySelected = selectedTags.some((t) => t._id === tag._id);

    const updatedTags = isAlreadySelected
      ? selectedTags.filter((t) => t._id !== tag._id)
      : [tag, ...selectedTags];

    onChange(updatedTags);
  };

  return (
    <Toggler>
      <Toggler.Toggle isLoading={isLoading}>
        {({ isOpen }) => (
          <div
            className={`w-12 h-12  group flex items-center justify-center rounded-full cursor-pointer transition duration-300
                ${isOpen ? " bg-blue-600 text-white" : " text-slate-900"}`}
          >
            <Tag size={20} />
            {!isOpen && !isLoading && (
              <Tooltip content="Choose Tags" position="top" />
            )}
          </div>
        )}
      </Toggler.Toggle>
      <Toggler.Menu>
        {({ closeMenu }) => (
          <div
            className="space-y-1 w-55 h-full max-h-96 overflow-y-auto overflow-x-hidden mb-2 bg-white py-4 px-2 rounded-lg shadow-md border border-slate-200 
          [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:bg-gray-400
    dark:[&::-webkit-scrollbar-track]:bg-neutral-400
    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700
          "
          >
            {tags?.length !== 0 ? (
              tags?.map(({ _id, name }) => {
                const isSelected = selectedTags.some((t) => t._id === _id);
                return (
                  <div
                    key={`tags-menu-item-${_id}`}
                    className={`flex items-center relative cursor-pointer bg-white w-full py-1.5 px-3 ps-9 rounded-lg text-sm hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 ${
                      isSelected ? "text-blue-600" : "text-sm text-gray-800"
                    }`}
                    onClick={() => {
                      onChooseTag({ _id, name });
                      // closeMenu?.();
                    }}
                  >
                    <CircleCheck
                      size={18}
                      className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${
                        isSelected ? "text-blue-600" : "text-sm text-gray-800"
                      }`}
                    />
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis w-full">
                      {name}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-sm text-slate-500">
                <span>No tags yet</span>
              </div>
            )}
          </div>
        )}
      </Toggler.Menu>
    </Toggler>
  );
}

export default TagsMenu;
