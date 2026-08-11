import { useState } from "react";
import { getZoneInventory } from "../../data/warehouseZones";
import { exportInventoryToExcel } from "../../utils/exportInventoryExcel";
import OrderDetailModal from "./OrderDetailModal";

const STATUS_FILTERS = [
  { id: "all", label: "Tất cả trạng thái" },
  { id: "no-bin", label: "Chưa xếp vào thùng" },
  { id: "no-position", label: "Đã vào thùng, chưa xếp vị trí" },
  { id: "placed", label: "Đã xếp vị trí trên giá" },
];

function getItemStatus(item) {
  if (!item.binId) return "no-bin";
  if (!item.positionId) return "no-position";
  return "placed";
}

const STATUS_META = {
  placed: {
    rowClass: "border-l-4 border-l-[#34d399] border-outline-variant bg-[#34d399]/5",
    textClass: "text-[#059669]",
    icon: "location_on",
    label: (item) => `${item.location} · Thùng ${item.binId}`,
  },
  "no-position": {
    rowClass: "border-l-4 border-l-[#F59E0B] border-outline-variant bg-[#F59E0B]/5",
    textClass: "text-[#92400e]",
    icon: "inventory_2",
    label: (item) => `Trong thùng ${item.binId} · chưa xếp vị trí`,
  },
  "no-bin": {
    rowClass: "border-dashed border-outline-variant bg-surface-bright opacity-80",
    textClass: "text-on-surface-variant",
    icon: "help_outline",
    label: () => "Chưa xếp vào thùng",
  },
};

const selectClass =
  "px-2.5 py-1.5 rounded-md border border-outline-variant bg-surface-bright text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

export default function InventoryCatalogCard({ zone, flushTop = false }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rackFilter, setRackFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  async function handleExport() {
    setExporting(true);
    try {
      await exportInventoryToExcel(zone.label, items, getItemStatus);
    } finally {
      setExporting(false);
    }
  }

  const rackOptions = [...new Set(zone.racks.map((r) => r.label))];
  const levelOptions = [...new Set(zone.racks.flatMap((r) => r.levels.map((l) => l.level)))].sort(
    (a, b) => a - b,
  );

  const items = getZoneInventory(zone).filter((item) => {
    const q = query.trim().toLowerCase();
    if (q && !(item.sku.toLowerCase().includes(q) || item.name.toLowerCase().includes(q))) return false;
    if (statusFilter !== "all" && getItemStatus(item) !== statusFilter) return false;
    if (rackFilter !== "all" && item.rackLabel !== rackFilter) return false;
    if (levelFilter !== "all" && String(item.level) !== levelFilter) return false;
    return true;
  });

  return (
    <div
      className={[
        "bg-surface-container-lowest border border-outline-variant p-lg shadow-sm h-full flex flex-col transition-shadow duration-200 hover:shadow-md",
        flushTop ? "rounded-tr-xl rounded-b-xl" : "rounded-xl",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-2 shrink-0">
        <h3 className="font-headline-sm text-headline-sm text-on-background truncate min-w-0">
          Danh sách hàng hóa
        </h3>
        <button
          type="button"
          onClick={handleExport}
          disabled={items.length === 0 || exporting}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-outline-variant text-on-surface-variant text-sm font-medium hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <span className={`material-symbols-outlined text-[18px] ${exporting ? "animate-spin" : ""}`}>
            {exporting ? "progress_activity" : "file_download"}
          </span>
          {exporting ? "Đang xuất..." : "Xuất Excel"}
        </button>
      </div>
      <p className="text-xs text-on-surface-variant mt-0.5 mb-2.5 shrink-0">{zone.label}</p>

      <div className="relative mb-2.5 shrink-0">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
          search
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo mã hàng, tên hàng..."
          className="w-full pl-9 pr-3 py-2 rounded-md border border-outline-variant bg-surface-bright text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-3 shrink-0">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          {STATUS_FILTERS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
        <select value={rackFilter} onChange={(e) => setRackFilter(e.target.value)} className={selectClass}>
          <option value="all">Tất cả kệ</option>
          {rackOptions.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className={selectClass}>
          <option value="all">Tất cả tầng</option>
          {levelOptions.map((level) => (
            <option key={level} value={level}>
              Tầng {level}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {items.length === 0 && (
          <p className="text-sm text-on-surface-variant">Không tìm thấy mã hàng nào phù hợp.</p>
        )}
        {items.map((item) => {
          const status = getItemStatus(item);
          const draggable = status === "no-bin";
          return (
            <div
              key={`${item.binId ?? "nobin"}-${item.orderCode}-${item.sku}`}
              draggable={draggable}
              onDragStart={(e) => {
                if (!draggable) return;
                e.dataTransfer.setData(
                  "application/x-wms-order",
                  JSON.stringify({ orderCode: item.orderCode, sku: item.sku }),
                );
              }}
              onClick={() => setSelectedOrder(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedOrder(item);
              }}
              className={[
                "px-4 py-3 rounded-lg border transition-colors cursor-pointer hover:shadow-sm",
                STATUS_META[status].rowClass,
                draggable ? "cursor-grab active:cursor-grabbing" : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex items-start gap-2">
                  {draggable && (
                    <span className="material-symbols-outlined text-on-surface-variant/60 text-lg mt-0.5 shrink-0">
                      drag_indicator
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-data-mono text-sm font-semibold text-on-background">{item.sku}</p>
                    <p className="text-sm text-on-surface-variant truncate mt-0.5">{item.name}</p>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-semibold text-on-background bg-surface-container-highest px-2.5 py-1 rounded-full">
                  SL: {item.quantity}
                </span>
              </div>

              <div className="mt-2">
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${STATUS_META[status].textClass}`}>
                  <span className="material-symbols-outlined text-[14px]">{STATUS_META[status].icon}</span>
                  {STATUS_META[status].label(item)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
