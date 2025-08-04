import React, { useEffect, useRef } from "react";

export default function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        ref={modalRef}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-white text-3xl font-bold focus:outline-none"
          aria-label="Fechar modal"
          type="button"
        >
          &times;
        </button>

        <div id="modal-content">{children}</div>
      </div>
    </div>
  );
}
