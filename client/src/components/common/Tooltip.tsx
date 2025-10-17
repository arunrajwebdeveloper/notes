type TooltipPositions = "top" | "right" | "bottom" | "left";

function Tooltip({
  content,
  position = "top",
}: {
  content: string;
  position?: TooltipPositions;
}) {
  const tooltipPosition = {
    top: "bottom-full mb-3 group-hover:translate-y-0 left-1/2 -translate-x-1/2 translate-y-1",
    right:
      "left-full ms-3 group-hover:translate-x-0 top-1/2 -translate-y-1/2 -translate-x-1",
    bottom:
      "top-full mt-3 group-hover:translate-y-0 left-1/2 -translate-x-1/2 -translate-y-1",
    left: "right-full me-3 group-hover:translate-x-0 top-1/2 -translate-y-1/2 translate-x-1",
  }[position];

  const arrowPosition = {
    top: "-bottom-1 left-1/2 -translate-x-1/2",
    right: "-left-1 top-1/2 -translate-y-1/2",
    bottom: "-top-1 left-1/2 -translate-x-1/2",
    left: "-right-1 top-1/2 -translate-y-1/2",
  }[position];

  return (
    <div
      className={`absolute
              opacity-0 invisible group-hover:opacity-100 group-hover:visible 
              bg-slate-700 text-white text-xs rounded py-2 px-4
              transition-all duration-300 ease-in-out whitespace-nowrap z-50 select-none pointer-events-none ${tooltipPosition}`}
    >
      <span className="relative z-10">{content}</span>
      <div
        className={`absolute w-3 h-3 bg-slate-700 transform rounded-xs z-0 rotate-45 ${arrowPosition}`}
      ></div>
    </div>
  );
}

export default Tooltip;
