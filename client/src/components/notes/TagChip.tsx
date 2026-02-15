import { X } from "lucide-react";
import CircleSpinner from "../common/CircleSpinner";

const TagChip = ({
  name,
  isLoading = false,
  onRemoveLabel,
  isTrash,
}: {
  name: string;
  isLoading?: boolean;
  onRemoveLabel: () => void;
  isTrash?: boolean;
}) => {
  return (
    <div className="bg-black/30 relative h-8 group flex items-center justify-between gap-2 text-white text-sm rounded-full select-none">
      <span
        className={`w-full px-2 whitespace-nowrap overflow-hidden text-ellipsis ${
          !isTrash ? "group-hover:max-w-[calc(100%-24px)]" : ""
        } ${isLoading ? "max-w-[calc(100%-24px)]" : ""}`}
      >
        {name}
      </span>

      {!isTrash && (
        <>
          {!isLoading && (
            <button
              disabled={isLoading || isTrash}
              onClick={onRemoveLabel}
              className="rounded-full absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 hidden group-hover:flex cursor-pointer bg-black/30"
            >
              <X size={16} className="m-auto" />
            </button>
          )}

          {isLoading && (
            <CircleSpinner
              size={20}
              className="text-slate-600 absolute right-1 top-1/2 -translate-y-1/2 flex"
            />
          )}
        </>
      )}
    </div>
  );
};

export default TagChip;
