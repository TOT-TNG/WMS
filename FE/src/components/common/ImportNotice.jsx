export default function ImportNotice({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between gap-2 mb-3 px-3 py-2 rounded-md bg-secondary-container/15 text-secondary text-xs">
      <span className="flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[16px]">info</span>
        {message}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        className="p-0.5 rounded-full hover:bg-secondary/10 transition-colors shrink-0"
        aria-label="Đóng thông báo"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}
