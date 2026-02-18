function CircleSpinner({
  color = "currentColor",
  className = "",
  size = 20,
  type = "circle",
}: {
  color?: string;
  className?: string;
  size?: number;
  type?: "circle" | "fetch";
}) {
  if (type === "circle")
    return (
      <svg
        width={size}
        height={size}
        className={`inline  animate-spin ${className ?? "text-black"}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-50"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-100"
          fill={color}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      width={size}
      height={size}
      className={`
        ${className} 
        origin-center 
        [animation:spinner-fetch_.75s_step-end_infinite]
      `}
    >
      <style>{`
        @keyframes spinner-fetch {
          8.3% { transform: rotate(30deg) }
          16.6% { transform: rotate(60deg) }
          25% { transform: rotate(90deg) }
          33.3% { transform: rotate(120deg) }
          41.6% { transform: rotate(150deg) }
          50% { transform: rotate(180deg) }
          58.3% { transform: rotate(210deg) }
          66.6% { transform: rotate(240deg) }
          75% { transform: rotate(270deg) }
          83.3% { transform: rotate(300deg) }
          91.6% { transform: rotate(330deg) }
          100% { transform: rotate(360deg) }
        }
      `}</style>
      <g>
        <rect x="11" y="1" width="2" height="5" opacity=".14" />
        <rect
          x="11"
          y="1"
          width="2"
          height="5"
          transform="rotate(30 12 12)"
          opacity=".29"
        />
        <rect
          x="11"
          y="1"
          width="2"
          height="5"
          transform="rotate(60 12 12)"
          opacity=".43"
        />
        <rect
          x="11"
          y="1"
          width="2"
          height="5"
          transform="rotate(90 12 12)"
          opacity=".57"
        />
        <rect
          x="11"
          y="1"
          width="2"
          height="5"
          transform="rotate(120 12 12)"
          opacity=".71"
        />
        <rect
          x="11"
          y="1"
          width="2"
          height="5"
          transform="rotate(150 12 12)"
          opacity=".86"
        />
        <rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)" />
      </g>
    </svg>
  );
}

export default CircleSpinner;
