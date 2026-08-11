import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/40 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <div
        className="custom-scrollbar bg-surface-container-lowest rounded-xl shadow-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto p-lg animate-[fade-in-up_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-headline-md text-headline-md text-on-background">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
