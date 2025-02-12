import React, { useRef } from "react";

const ToolTip = ({ children, tooltip, positionClass }) => {
  const tooltipRef = useRef(null);
  const container = useRef(null);

  const handleMouseEnter = () => {
    if (!tooltipRef.current || !container.current || !positionClass) return;
    const { left, right } = container.current.getBoundingClientRect();
    const tooltipWidth = tooltipRef.current.offsetWidth;

    if (positionClass === "mr-0") {
      tooltipRef.current.style.left = `-${tooltipWidth}px`;
    } else if (positionClass === "ml-0") {
      tooltipRef.current.style.left = `${right - left}px`;
    }
  };

  return (
    <div
      ref={container}
      onMouseEnter={handleMouseEnter}
      className="group relative"
    >
      {children}
      {tooltip ? (
        <span
          ref={tooltipRef}
          className="z-50 invisible group-hover:visible opacity-0 group-hover:opacity-80 transition absolute flex justify-center items-center bottom-0 top-0 whitespace-nowrap"
        >
          <p className="bg-gray-700 text-white text-xs p-2 rounded w-fit h-fit mx-2">
            {tooltip}
          </p>
        </span>
      ) : null}
    </div>
  );
};

export default ToolTip;
