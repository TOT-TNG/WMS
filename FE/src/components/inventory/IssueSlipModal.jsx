import { useState } from "react";
import Modal from "../common/Modal";
import { getZoneInventory } from "../../data/warehouseZones";

function lineKey(item) {
  return `${item.binId}-${item.orderCode}-${item.sku}`;
}

export default function IssueSlipModal({ open, onClose, zone, onConfirm }) {
  const [query, setQuery] = useState("");
  const [lines, setLines] = useState([]);

  const availableItems = getZoneInventory(zone).filter((item) => item.binId);
  const addedKeys = new Set(lines.map((l) => l.key));
  const searchResults =
    query.trim().length === 0
      ? []
      : availableItems.filter((item) => {
          if (addedKeys.has(lineKey(item))) return false;
          const q = query.trim().toLowerCase();
          return item.sku.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
        });

  function addLine(item) {
    setLines((prev) => [
      ...prev,
      {
        key: lineKey(item),
        binId: item.binId,
        orderCode: item.orderCode,
        sku: item.sku,
        name: item.name,
        location: item.location,
        available: item.quantity,
        quantity: item.quantity,
      },
    ]);
    setQuery("");
  }

  function updateQuantity(key, value) {
    setLines((prev) =>
      prev.map((l) =>
        l.key === key ? { ...l, quantity: Math.max(1, Math.min(Number(value) || 1, l.available)) } : l,
      ),
    );
  }

  function removeLine(key) {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }

  function resetAndClose() {
    setQuery("");
    setLines([]);
    onClose();
  }

  function handleConfirm() {
    if (lines.length === 0) return;
    onConfirm(lines);
    resetAndClose();
  }

  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <Modal open={open} onClose={resetAndClose} title={`Phiếu xuất kho — ${zone.label}`}>
      <div className="relative mb-3">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
          search
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm mã hàng đang có trong kho để thêm vào phiếu..."
          className="w-full pl-9 pr-3 py-2 rounded-md border border-outline-variant bg-surface-bright text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto custom-scrollbar bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg">
            {searchResults.map((item) => (
              <button
                key={lineKey(item)}
                type="button"
                onClick={() => addLine(item)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-surface-container-low transition-colors border-b border-outline-variant/50 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-background">{item.sku}</p>
                  <p className="text-xs text-on-surface-variant truncate">
                    {item.name} · Tồn: {item.quantity}
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">add_circle</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide mb-2">
        Các dòng trong phiếu ({lines.length})
      </h4>

      {lines.length === 0 ? (
        <p className="text-sm text-on-surface-variant">Tìm và thêm mã hàng ở trên để bắt đầu tạo phiếu xuất.</p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          {lines.map((line) => (
            <div key={line.key} className="px-4 py-3 rounded-lg border border-outline-variant bg-surface-bright">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-background">{line.sku}</p>
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">{line.name}</p>
                  {line.location && (
                    <p className="text-xs text-on-surface-variant mt-0.5">{line.location}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.key)}
                  className="shrink-0 p-1 rounded-full hover:bg-error-container text-on-surface-variant hover:text-error transition-colors"
                  aria-label={`Bỏ ${line.sku} khỏi phiếu`}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <label className="text-xs text-on-surface-variant shrink-0">
                  Xuất (tồn {line.available}):
                </label>
                <input
                  type="number"
                  min="1"
                  max={line.available}
                  value={line.quantity}
                  onChange={(e) => updateQuantity(line.key, e.target.value)}
                  className="w-20 px-2 py-1 rounded-md border border-outline-variant bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-outline-variant/50">
        <p className="text-sm text-on-surface-variant">
          {lines.length} dòng · {totalQuantity} sản phẩm
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetAndClose}
            className="px-4 py-2 rounded-md text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={lines.length === 0}
            className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-40 disabled:pointer-events-none"
          >
            Xác nhận xuất kho
          </button>
        </div>
      </div>
    </Modal>
  );
}
