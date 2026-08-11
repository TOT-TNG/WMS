import { useEffect, useRef, useState } from "react";

export default function ImportMenu({
  label = "Nhập dữ liệu",
  icon = "add",
  iconOnly = false,
  onSelectFile,
  onOpenDatabaseImport,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative shrink-0" ref={wrapperRef}>
      {iconOnly ? (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={label}
          className="flex items-center justify-center w-7 h-7 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-outline-variant text-sm font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
          {label}
        </button>
      )}

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-30 overflow-hidden animate-[fade-in-up_0.15s_ease-out]">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              fileInputRef.current?.click();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">upload_file</span>
            Nhập từ file (Excel/CSV)
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onOpenDatabaseImport?.();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors text-left border-t border-outline-variant/50"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">database</span>
            Nhập từ cơ sở dữ liệu
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelectFile?.(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
