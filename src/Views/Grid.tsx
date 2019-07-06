import React from "react";
import { useMappedState } from "../utils";

export const Grid: React.FC = () => {
  const { scale } = useMappedState(({ canvasTransform }) => ({
    scale: canvasTransform.s,
  }));

  return (
    <div className="grid-container">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="grid"
            width={10 * scale}
            height={10 * scale}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${10 * scale} 0 L 0 0 0 ${10 * scale}`}
              fill="none"
              stroke="rgba(207, 207, 207, 0.8)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};
