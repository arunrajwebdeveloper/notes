import { X } from "lucide-react";

const TagChip = ({
  name,
  isLoading = false,
  onRemoveLabel,
}: {
  name: string;
  isLoading?: boolean;
  onRemoveLabel: () => void;
}) => {
  return (
    <div className="bg-black/30 relative h-8 group flex items-center justify-between gap-2 text-white text-sm rounded-full">
      <span className="w-full px-2 group-hover:max-w-[calc(100%-24px)] whitespace-nowrap overflow-hidden text-ellipsis">
        {name}
      </span>
      <button
        disabled={isLoading}
        onClick={onRemoveLabel}
        className="rounded-full absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 hidden group-hover:flex cursor-pointer bg-black/30"
      >
        <X size={16} className="m-auto" />
      </button>
    </div>
  );
};

export default TagChip;
