import React, { useEffect, useRef } from "react";

const Popup = ({ isOpen, onClose, children, width }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isOpen &&
        event.target instanceof Element &&
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !event.target.closest(".exclude-close")
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (isOpen && event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div
            ref={popupRef}
            className="bg-white z-10 rounded-lg"
            style={width ? { width: width } : { width: "70%" }}
          >
            <span
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 cursor-pointer text-xl"
            >
              &times;
            </span>
            <div className="exclude-close">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
